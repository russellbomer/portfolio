/**
 * Terminal WebSocket Server with Per-Session Container Sandbox
 *
 * Features:
 * - WebSocket terminal connections via per-session Docker containers
 * - Session-isolated file storage for quarry outputs
 * - HTTP endpoints for file listing and download
 * - Automatic session cleanup on disconnect
 * - Token-gated WebSocket connections
 * - Per-IP rate limiting (concurrent sessions, connection rate, message rate)
 *
 * Security:
 * - NO host shell spawning - all sessions run in isolated containers
 * - Containers run with --network none, --read-only, cap-drop ALL, etc.
 * - User input goes directly to container stdin, never shell-interpreted on host
 * - Session tokens required for WS connections (short-lived, IP-bound)
 *
 * Environment variables:
 * - See src/config.ts for all configuration options
 * - MANUAL: TOKEN_SECRET must be set on the droplet
 */

import { randomUUID } from "crypto";
import fs from "fs";
import http from "http";
import path from "path";
import { URL } from "url";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";

import {
  createSandbox,
  checkDockerReady,
  cleanupOrphanedContainers,
  type SandboxSession,
} from "./src/sandboxRunner.js";
import {
  SERVER_PORT,
  SERVER_HOST,
  OUTPUT_DIR,
  AUTO_RUN_CMD,
  DEBUG,
  FILE_SETTINGS,
  ALLOWED_HOSTS,
  validateConfig,
} from "./src/config.js";
import {
  createSessionToken,
  validateSessionToken,
  getTokenStats,
} from "./src/tokenManager.js";
import {
  checkConnectionRate,
  checkConcurrentSessions,
  releaseSession,
  checkMessageRate,
  getRateLimiterStats,
} from "./src/rateLimiter.js";

// Debug logging (uses DEBUG from config)
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[server]", ...args);
};
if (DEBUG) console.log("BOOTSTRAP: apps/terminal/server.ts starting");

// Shorthand for file settings
const MAX_FILE_SIZE = FILE_SETTINGS.maxFileSize;
const MAX_SESSION_STORAGE = FILE_SETTINGS.maxSessionStorage;
const ALLOWED_EXTENSIONS = FILE_SETTINGS.allowedExtensions;

// Track active sessions for cleanup (includes IP for rate limiter cleanup)
const activeSessions = new Map<
  string,
  { ws: WebSocket; sandbox: SandboxSession; ip: string }
>();

// Ensure output directory exists
try {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  log(`Output directory ready: ${OUTPUT_DIR}`);
} catch (err) {
  console.error(`Failed to create output directory: ${OUTPUT_DIR}`, err);
}

/**
 * Validate session ID format (UUID v4)
 */
function isValidSessionId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * Sanitize filename - only allow safe characters
 */
function sanitizeFilename(filename: string): string | null {
  // Normalize path and remove any leading slashes or backslashes
  const normalized = path.normalize(filename).replace(/^[/\\]+/, "");

  // Reject paths with .. to prevent traversal
  if (normalized.includes("..")) {
    return null;
  }

  // Split into parts and validate each component
  const parts = normalized.split(path.sep);
  for (const part of parts) {
    // Allow alphanumeric, dots, hyphens, underscores for each path component
    if (!/^[\w.-]+$/.test(part)) {
      return null;
    }
  }

  // Check extension of the final filename
  const ext = path.extname(normalized).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return null;
  }

  return normalized;
}

/**
 * Get session directory path
 */
function getSessionDir(sessionId: string): string {
  return path.join(OUTPUT_DIR, sessionId);
}

/**
 * Get total size of session directory
 */
function getSessionStorageSize(sessionId: string): number {
  const sessionDir = getSessionDir(sessionId);
  if (!fs.existsSync(sessionDir)) return 0;
  try {
    return fs.readdirSync(sessionDir).reduce((total, file) => {
      const filePath = path.join(sessionDir, file);
      const stats = fs.statSync(filePath);
      return total + stats.size;
    }, 0);
  } catch {
    return 0;
  }
}

/**
 * Clean up session directory
 */
function cleanupSession(sessionId: string): void {
  const sessionDir = getSessionDir(sessionId);
  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      log(`Cleaned up session: ${sessionId}`);
    }
  } catch (err) {
    console.error(`Cleanup failed for ${sessionId}:`, err);
  }
}

/**
 * Handle file listing request
 */
function handleFileList(sessionId: string, res: http.ServerResponse): void {
  const sessionDir = getSessionDir(sessionId);

  if (!fs.existsSync(sessionDir)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Session not found" }));
    return;
  }

  try {
    // Recursively find all files in session directory
    const findFiles = (
      dir: string,
      prefix = ""
    ): Array<{ name: string; size: number; modified: string }> => {
      const results: Array<{ name: string; size: number; modified: string }> =
        [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectories, building the relative path
          const newPrefix = prefix ? `${prefix}/${entry.name}` : entry.name;
          results.push(...findFiles(fullPath, newPrefix));
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALLOWED_EXTENSIONS.includes(ext)) {
            const stats = fs.statSync(fullPath);
            // Build relative path from session directory
            const relativePath = prefix
              ? `${prefix}/${entry.name}`
              : entry.name;

            log(`Found file: ${relativePath} (${stats.size} bytes)`);

            results.push({
              name: relativePath,
              size: stats.size,
              modified: stats.mtime.toISOString(),
            });
          }
        }
      }

      return results;
    };

    const files = findFiles(sessionDir);
    const totalSize = getSessionStorageSize(sessionId);
    const storageWarning = totalSize > MAX_SESSION_STORAGE * 0.8;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        files,
        storage: {
          used: totalSize,
          limit: MAX_SESSION_STORAGE,
          warning: storageWarning,
        },
      })
    );
  } catch (err) {
    console.error(`Failed to list files for ${sessionId}:`, err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to list files" }));
  }
}

/**
 * Handle file download request
 */
function handleFileDownload(
  sessionId: string,
  filename: string,
  res: http.ServerResponse
): void {
  const sessionDir = getSessionDir(sessionId);

  // Sanitize filename
  const safeName = sanitizeFilename(filename);
  if (!safeName) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid filename" }));
    return;
  }

  const filePath = path.join(sessionDir, safeName);
  log(`Resolved file path: ${filePath}`);

  // Verify file is within session directory (prevent path traversal)
  const resolvedPath = path.resolve(filePath);
  const resolvedSessionDir = path.resolve(sessionDir);
  if (!resolvedPath.startsWith(resolvedSessionDir)) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Access denied" }));
    return;
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "File not found" }));
    return;
  }

  // Check file size
  const stats = fs.statSync(filePath);
  if (stats.size > MAX_FILE_SIZE) {
    res.writeHead(413, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "File too large" }));
    return;
  }

  // Determine MIME type
  const ext = path.extname(safeName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".json": "application/json",
    ".jsonl": "application/x-ndjson",
    ".csv": "text/csv",
    ".html": "text/html",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".yml": "text/yaml",
    ".yaml": "text/yaml",
  };

  // Extract just the filename (not the full path) for download
  const downloadFilename = path.basename(safeName);

  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${downloadFilename}"`,
    "Content-Length": stats.size,
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

/**
 * Get client IP address from request
 */
function getClientIp(req: http.IncomingMessage): string {
  // Check X-Forwarded-For header (when behind nginx/proxy)
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const forwardedIp = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(",")[0].trim();
    if (forwardedIp) return forwardedIp;
  }

  // Check X-Real-IP header
  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  // Fall back to socket remote address
  return req.socket.remoteAddress || "unknown";
}

/**
 * Validate Host header against allowed hosts
 * Returns true if host is allowed, false otherwise
 */
function isHostAllowed(req: http.IncomingMessage): boolean {
  const hostHeader = req.headers.host || "";
  // Extract hostname without port
  const hostname = hostHeader.split(":")[0].toLowerCase();
  
  // Check if hostname matches any allowed host
  return ALLOWED_HOSTS.includes(hostname);
}

/**
 * HTTP request handler
 */
function handleHttpRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const reqUrl = req.url || "/";
  const clientIp = getClientIp(req);

  // Validate Host header - reject unexpected hosts (security: prevent host header attacks)
  if (!isHostAllowed(req)) {
    log(`Rejected request with invalid Host header: ${req.headers.host} from ${clientIp}`);
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden: Invalid Host header");
    return;
  }

  // Add CORS headers for development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check (includes rate limiter stats)
  if (reqUrl === "/health") {
    const tokenStats = getTokenStats();
    const rateLimiterStats = getRateLimiterStats();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        activeSessions: activeSessions.size,
        tokens: tokenStats,
        rateLimiter: rateLimiterStats,
      })
    );
    return;
  }

  // POST /session - Issue a session token
  if (reqUrl === "/session" && req.method === "POST") {
    // Check connection rate limit
    const rateCheck = checkConnectionRate(clientIp);
    if (!rateCheck.allowed) {
      res.writeHead(429, {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((rateCheck.retryAfterMs || 60000) / 1000).toString(),
      });
      res.end(JSON.stringify({ error: rateCheck.reason }));
      return;
    }

    // Generate token
    const userAgent = req.headers["user-agent"] || "";
    const token = createSessionToken(clientIp, userAgent);

    log(`Issued session token to IP ${clientIp}`);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ token }));
    return;
  }

  // File endpoints
  if (reqUrl.startsWith("/files") && req.method === "GET") {
    try {
      const url = new URL(reqUrl, `http://${req.headers.host || "localhost"}`);
      const sessionId = url.searchParams.get("session");

      // Validate session ID
      if (!sessionId || !isValidSessionId(sessionId)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid session ID" }));
        return;
      }

      // Extract filename from path: /files/filename.json -> filename.json
      const pathParts = url.pathname.split("/").filter(Boolean);
      const filename =
        pathParts.length > 1 ? pathParts.slice(1).join("/") : null;

      if (filename) {
        // Download specific file
        handleFileDownload(sessionId, filename, res);
      } else {
        // List files
        handleFileList(sessionId, res);
      }
      return;
    } catch (err) {
      console.error("File request error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
      return;
    }
  }

  // 404 for everything else
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
}

// Create HTTP server
const server = http.createServer(handleHttpRequest);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", async (ws: WebSocket, req) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "";

  log(`WS connection attempt from ${clientIp}`);

  // Validate Host header first - reject unexpected hosts
  if (!isHostAllowed(req)) {
    log(`Rejected WS connection with invalid Host header: ${req.headers.host} from ${clientIp}`);
    ws.send(JSON.stringify({ type: "error", error: "Forbidden: Invalid Host header" }));
    ws.close(4003, "Forbidden: Invalid Host header");
    return;
  }

  // Extract token from query string
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const token = url.searchParams.get("token");

  // Validate token
  const tokenResult = validateSessionToken(token || "", clientIp, userAgent);
  if (!tokenResult.valid) {
    log(`Token validation failed for ${clientIp}: ${tokenResult.error}`);
    ws.send(JSON.stringify({ type: "error", error: tokenResult.error }));
    ws.close(4001, tokenResult.error);
    return;
  }

  // Generate unique session ID
  const sessionId = randomUUID();
  const sessionDir = getSessionDir(sessionId);

  // Check concurrent session limit
  const concurrentCheck = checkConcurrentSessions(clientIp, sessionId);
  if (!concurrentCheck.allowed) {
    log(`Concurrent session limit for ${clientIp}: ${concurrentCheck.reason}`);
    ws.send(JSON.stringify({ type: "error", error: concurrentCheck.reason }));
    ws.close(4002, concurrentCheck.reason);
    return;
  }

  log(`Connection from ${clientIp}, session: ${sessionId}`);

  // Create session directory
  try {
    fs.mkdirSync(sessionDir, { recursive: true });
    log(`Created directory: ${sessionDir}`);
  } catch (err) {
    console.error(`Failed to create directory: ${sessionDir}`, err);
    ws.send(
      "\x1b[1;31m[server]\x1b[0m Failed to create session directory.\r\n"
    );
    ws.close();
    releaseSession(clientIp, sessionId);
    return;
  }

  // Send session ID to client
  ws.send(JSON.stringify({ type: "session", id: sessionId }));

  // Create sandbox container for this session
  let sandbox: SandboxSession;
  try {
    sandbox = await createSandbox({
      sessionId,
      sessionDir: path.resolve(sessionDir),
      cols: 80,
      rows: 24,
      autoRunCmd: AUTO_RUN_CMD || undefined,
    });
    log(`Sandbox created for session ${sessionId}`);
  } catch (err) {
    console.error(`Failed to create sandbox for ${sessionId}:`, err);
    ws.send(
      `\x1b[1;31m[server]\x1b[0m Failed to start session container: ${err instanceof Error ? err.message : String(err)}\r\n`
    );
    ws.close();
    cleanupSession(sessionId);
    releaseSession(clientIp, sessionId);
    return;
  }

  // Track active session (with IP for cleanup)
  activeSessions.set(sessionId, { ws, sandbox, ip: clientIp });

  // Forward container output to WebSocket
  sandbox.on("data", (data: string) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  });

  // Handle container exit
  sandbox.on("exit", ({ exitCode }) => {
    log(`Container exited with code ${exitCode} for session ${sessionId}`);
    if (ws.readyState === ws.OPEN) {
      ws.send(
        `\r\n\x1b[1;33m[server]\x1b[0m Session ended (exit ${exitCode}).\r\n`
      );
      ws.close();
    }
  });

  // Handle container errors
  sandbox.on("error", (err: Error) => {
    console.error(`Sandbox error for ${sessionId}:`, err);
    if (ws.readyState === ws.OPEN) {
      ws.send(
        `\r\n\x1b[1;31m[server]\x1b[0m Container error: ${err.message}\r\n`
      );
      ws.close();
    }
  });

  // Handle WebSocket messages (with rate limiting)
  ws.on("message", (msg: Buffer) => {
    // Check message rate limit
    const rateCheck = checkMessageRate(sessionId);
    if (!rateCheck.allowed) {
      log(`Message rate limit exceeded for session ${sessionId}`);
      ws.send(JSON.stringify({ type: "error", error: rateCheck.reason }));
      ws.close(4003, "Rate limit exceeded");
      return;
    }

    // Warn if approaching limit
    if (rateCheck.warning) {
      ws.send(JSON.stringify({ type: "warning", message: "Message rate approaching limit" }));
    }

    const text = msg.toString();
    log(`WS message: ${text.slice(0, 80)}`);

    try {
      const parsed = JSON.parse(text);

      // Handle input messages - write directly to container stdin
      if (
        parsed &&
        parsed.type === "input" &&
        typeof parsed.data === "string"
      ) {
        sandbox.write(parsed.data);
        return;
      }

      // Handle resize messages
      if (
        parsed &&
        parsed.type === "resize" &&
        typeof parsed.cols === "number" &&
        typeof parsed.rows === "number"
      ) {
        sandbox.resize(parsed.cols, parsed.rows);
        return;
      }

      // Unknown message type, ignore
      log(`Unknown message type: ${parsed?.type}`);
    } catch {
      // Not JSON, write raw to container
      sandbox.write(text);
    }
  });

  // Handle WebSocket close
  ws.on("close", async () => {
    log(`Client disconnected, session: ${sessionId}`);
    activeSessions.delete(sessionId);
    releaseSession(clientIp, sessionId);

    try {
      await sandbox.kill();
    } catch {
      // Ignore kill errors
    }

    // Clean up session directory after a short delay
    setTimeout(() => cleanupSession(sessionId), 1000);
  });

  // Handle WebSocket errors
  ws.on("error", async (err) => {
    console.error(`WebSocket error for ${sessionId}:`, err);
    activeSessions.delete(sessionId);
    releaseSession(clientIp, sessionId);

    try {
      await sandbox.kill();
    } catch {
      // Ignore kill errors
    }

    cleanupSession(sessionId);
  });
});

// Startup sequence
async function startServer(): Promise<void> {
  console.log("[terminal] Starting server...");

  // Validate configuration
  const configCheck = validateConfig();
  
  // Log warnings
  if (configCheck.warnings.length > 0) {
    console.warn("[terminal] Configuration warnings:");
    for (const warning of configCheck.warnings) {
      console.warn(`  - ${warning}`);
    }
  }
  
  if (!configCheck.valid) {
    console.error("[terminal] Configuration errors:");
    for (const error of configCheck.errors) {
      console.error(`  - ${error}`);
    }
    // In development, allow starting without TOKEN_SECRET (will fail token validation)
    // In production, this should be fatal
    if (process.env.NODE_ENV === "production") {
      console.error("[terminal] Cannot start in production without valid configuration.");
      process.exit(1);
    }
    console.warn("[terminal] Continuing in development mode (token validation may fail)...");
  }
  
  console.log(`[terminal] Allowed hosts: ${ALLOWED_HOSTS.join(", ")}`);

  // Check Docker availability
  const dockerCheck = await checkDockerReady();
  if (!dockerCheck.ready) {
    console.error(`[terminal] Docker not ready: ${dockerCheck.error}`);
    console.error(
      "[terminal] Please ensure Docker is running and the sandbox image is built."
    );
    console.error(
      "[terminal] Build with: docker build -t quarry-session:latest -f deploy/docker/Dockerfile.session ."
    );
    process.exit(1);
  }
  console.log("[terminal] Docker ready");

  // Clean up any orphaned containers from previous runs
  const cleaned = await cleanupOrphanedContainers();
  if (cleaned > 0) {
    console.log(`[terminal] Cleaned up ${cleaned} orphaned container(s)`);
  }

  // Start HTTP/WS server
  server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`[terminal] Listening on http://${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`[terminal] Output directory: ${path.resolve(OUTPUT_DIR)}`);
    console.log(`[terminal] Endpoints:`);
    console.log(`  - GET /health`);
    console.log(`  - POST /session (get token)`);
    console.log(`  - GET /ws?token=... (WebSocket)`);
    console.log(`  - GET /files?session=<uuid>`);
    console.log(`  - GET /files/<filename>?session=<uuid>`);
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[terminal] SIGTERM received, shutting down...");

  // Kill all active sessions
  const killPromises: Promise<void>[] = [];
  for (const [sessionId, { sandbox, ip }] of activeSessions) {
    killPromises.push(sandbox.kill().catch(() => {}));
    releaseSession(ip, sessionId);
    cleanupSession(sessionId);
  }
  await Promise.all(killPromises);

  server.close(() => {
    console.log("[terminal] Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("[terminal] SIGINT received, shutting down...");

  // Kill all active sessions
  const killPromises: Promise<void>[] = [];
  for (const [sessionId, { sandbox, ip }] of activeSessions) {
    killPromises.push(sandbox.kill().catch(() => {}));
    releaseSession(ip, sessionId);
    cleanupSession(sessionId);
  }
  await Promise.all(killPromises);

  server.close(() => {
    console.log("[terminal] Server closed");
    process.exit(0);
  });
});

// Start the server
startServer().catch((err) => {
  console.error("[terminal] Failed to start:", err);
  process.exit(1);
});
