/**
 * Terminal WebSocket Server with Per-Session Container Sandbox
 *
 * Features:
 * - WebSocket terminal connections via per-session Docker containers
 * - Session-isolated file storage for quarry outputs
 * - HTTP endpoints for file listing and download
 * - Automatic session cleanup on disconnect
 *
 * Security:
 * - NO host shell spawning - all sessions run in isolated containers
 * - Containers run with --network none, --read-only, cap-drop ALL, etc.
 * - User input goes directly to container stdin, never shell-interpreted on host
 *
 * Environment variables:
 * - TERMINAL_PORT (default: 4000)
 * - TERMINAL_HOST (default: 127.0.0.1)
 * - TERMINAL_OUTPUT_DIR (default: ./data/quarry-output)
 * - TERMINAL_DEBUG (default: false)
 * - SANDBOX_IMAGE (default: quarry-session:latest)
 * - TERMINAL_AUTO_RUN (default: "quarry")
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

// Debug logging
const DEBUG =
  process.env.TERMINAL_DEBUG === "1" || process.env.TERMINAL_DEBUG === "true";
const log = (...args: unknown[]) => {
  if (DEBUG) console.log("[server]", ...args);
};
if (DEBUG) console.log("BOOTSTRAP: apps/terminal/server.ts starting");

// Configuration
const PORT = parseInt(process.env.TERMINAL_PORT || "4000", 10);
const HOST = process.env.TERMINAL_HOST || "127.0.0.1";
const OUTPUT_DIR = process.env.TERMINAL_OUTPUT_DIR || "./data/quarry-output";

// Auto-run command when session starts (default: quarry interactive mode)
const AUTO_RUN_CMD = process.env.TERMINAL_AUTO_RUN || "quarry";

// File download settings
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_SESSION_STORAGE = 50 * 1024 * 1024; // 50MB per session
const ALLOWED_EXTENSIONS = [
  ".json",
  ".jsonl",
  ".csv",
  ".html",
  ".txt",
  ".md",
  ".yml",
  ".yaml",
];

// Track active sessions for cleanup
const activeSessions = new Map<
  string,
  { ws: WebSocket; sandbox: SandboxSession }
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
 * HTTP request handler
 */
function handleHttpRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const reqUrl = req.url || "/";

  // Add CORS headers for development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (reqUrl === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        activeSessions: activeSessions.size,
      })
    );
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
  // Generate unique session ID
  const sessionId = randomUUID();
  const sessionDir = getSessionDir(sessionId);

  log(`Connection from ${req.socket.remoteAddress}, session: ${sessionId}`);

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
    return;
  }

  // Track active session
  activeSessions.set(sessionId, { ws, sandbox });

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

  // Handle WebSocket messages
  ws.on("message", (msg: Buffer) => {
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
  server.listen(PORT, HOST, () => {
    console.log(`[terminal] Listening on http://${HOST}:${PORT}`);
    console.log(`[terminal] Output directory: ${path.resolve(OUTPUT_DIR)}`);
    console.log(`[terminal] Endpoints:`);
    console.log(`  - GET /health`);
    console.log(`  - GET /ws (WebSocket)`);
    console.log(`  - GET /files?session=<uuid>`);
    console.log(`  - GET /files/<filename>?session=<uuid>`);
  });
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[terminal] SIGTERM received, shutting down...");

  // Kill all active sessions
  const killPromises: Promise<void>[] = [];
  for (const [sessionId, { sandbox }] of activeSessions) {
    killPromises.push(sandbox.kill().catch(() => {}));
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
  for (const [sessionId, { sandbox }] of activeSessions) {
    killPromises.push(sandbox.kill().catch(() => {}));
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
