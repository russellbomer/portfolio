/**
 * Terminal WebSocket Server with Session File Management
 *
 * Features:
 * - WebSocket terminal connections via node-pty
 * - Session-isolated file storage for quarry outputs
 * - HTTP endpoints for file listing and download
 * - Automatic session cleanup on disconnect
 *
 * Environment variables:
 * - TERMINAL_PORT (default: 4000)
 * - TERMINAL_HOST (default: 127.0.0.1)
 * - TERMINAL_OUTPUT_DIR (default: ./data/quarry-output)
 * - TERMINAL_DEBUG (default: false)
 * - TERMINAL_QUARRY_MODE (default: false)
 * - TERMINAL_QUARRY_PATH (default: quarry)
 * - TERMINAL_AUTO_RUN (default: "")
 */

import { randomUUID } from "crypto";
import fs from "fs";
import http from "http";
import path from "path";
import { URL } from "url";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";

// Debug logging
const DEBUG =
  process.env.TERMINAL_DEBUG === "1" || process.env.TERMINAL_DEBUG === "true";
const log = (...args: unknown[]) => {
  if (DEBUG) console.log(...args);
};
if (DEBUG) console.log("BOOTSTRAP: server/terminal/server.ts starting");

// node-pty is optional; require at runtime and handle absence gracefully
let pty: typeof import("node-pty") | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  pty = require("node-pty");
  log("[init] node-pty loaded");
} catch (err) {
  console.error("[init] node-pty failed to load", err);
  pty = null;
}

// Configuration
const PORT = parseInt(process.env.TERMINAL_PORT || "4000", 10);
const HOST = process.env.TERMINAL_HOST || "127.0.0.1";
const OUTPUT_DIR = process.env.TERMINAL_OUTPUT_DIR || "./data/quarry-output";

// Quarry-only mode: spawn quarry interactive shell instead of bash
const QUARRY_MODE = process.env.TERMINAL_QUARRY_MODE === "true";
const QUARRY_PATH = process.env.TERMINAL_QUARRY_PATH || "quarry";
const AUTO_RUN_CMD = process.env.TERMINAL_AUTO_RUN || "";

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

// Session timeout (15 minutes of idle = disconnect)
const SESSION_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

// Track active sessions for cleanup
const activeSessions = new Map<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { ws: WebSocket; proc: any; idleTimer: NodeJS.Timeout | null }
>();

// Ensure output directory exists
try {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  log(`[init] Output directory ready: ${OUTPUT_DIR}`);
} catch (err) {
  console.error(`[init] Failed to create output directory: ${OUTPUT_DIR}`, err);
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
  const basename = path.basename(filename);
  // Only allow alphanumeric, dots, hyphens, underscores
  if (!/^[\w.-]+$/.test(basename)) {
    return null;
  }
  // Check extension
  const ext = path.extname(basename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return null;
  }
  return basename;
}

/**
 * Filter dangerous cd commands to prevent directory traversal
 * Returns: { allowed: boolean, message?: string }
 */
function filterCdCommand(
  input: string,
  _sessionDir: string
): { allowed: boolean; message?: string } {
  const trimmed = input.trim();

  // Check if this is a cd command
  if (!trimmed.startsWith("cd ") && trimmed !== "cd") {
    return { allowed: true }; // Not a cd command, allow it
  }

  // Extract the target path
  const cdMatch = trimmed.match(/^cd\s+(.+)$/);
  if (!cdMatch) {
    return { allowed: true }; // Just "cd" with no args (go to HOME), allow it
  }

  const target = cdMatch[1].trim();

  // Block dangerous patterns
  const dangerousPatterns = [
    /^\.\.\/?/, // Starts with ../
    /\/\.\.\/?/, // Contains /../
    /^\//, // Absolute path
    /^~\//, // Home directory reference (could escape session)
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(target)) {
      log(`[security] Blocked cd command: ${trimmed}`);
      return {
        allowed: false,
        message: `\r\n\u001b[1;31m[security]\u001b[0m Directory navigation restricted to session directory.\r\n`,
      };
    }
  }

  // Allow relative paths within session directory
  return { allowed: true };
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
      log(`[session] Cleaned up: ${sessionId}`);
    }
  } catch (err) {
    console.error(`[session] Cleanup failed for ${sessionId}:`, err);
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
    const files = fs
      .readdirSync(sessionDir)
      .filter((f) => {
        const ext = path.extname(f).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
      })
      .map((f) => {
        const filePath = path.join(sessionDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      });

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
    console.error(`[files] Failed to list files for ${sessionId}:`, err);
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

  // Verify file is within session directory (prevent path traversal)
  const resolvedPath = path.resolve(filePath);
  const resolvedSessionDir = path.resolve(sessionDir);
  if (!resolvedPath.startsWith(resolvedSessionDir)) {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Access denied" }));
    return;
  }

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
    ".csv": "text/csv",
    ".html": "text/html",
    ".txt": "text/plain",
    ".md": "text/markdown",
  };

  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${safeName}"`,
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

  // Health check
  if (reqUrl === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
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
      console.error("[files] Request error:", err);
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

wss.on("connection", (ws: WebSocket, req) => {
  // Generate unique session ID
  const sessionId = randomUUID();
  const sessionDir = getSessionDir(sessionId);

  log(
    `[ws] Connection from ${req.socket.remoteAddress}, session: ${sessionId}`
  );

  // Create session directory
  try {
    fs.mkdirSync(sessionDir, { recursive: true });
    log(`[session] Created directory: ${sessionDir}`);
  } catch (err) {
    console.error(`[session] Failed to create directory: ${sessionDir}`, err);
  }

  // Send session ID to client
  ws.send(JSON.stringify({ type: "session", id: sessionId }));

  if (!pty) {
    console.error("[server] node-pty is unavailable. Terminal disabled.");
    ws.send(
      "\u001b[1;31m[server]\u001b[0m node-pty is unavailable. Terminal disabled.\r\n"
    );
    ws.close();
    cleanupSession(sessionId);
    return;
  }

  const cols = 80;
  const rows = 24;

  // Set up environment with session directory
  const ptyEnv = {
    ...process.env,
    HOME: sessionDir,
    QUARRY_OUTPUT_DIR: sessionDir,
  };

  // Determine what to spawn
  let spawnCmd: string;
  let spawnArgs: string[];

  if (QUARRY_MODE) {
    spawnCmd = QUARRY_PATH;
    spawnArgs = [];
    log(`[pty] Quarry mode enabled, spawning: ${spawnCmd}`);
  } else {
    spawnCmd =
      process.platform === "win32"
        ? "powershell.exe"
        : process.env.SHELL || "bash";
    spawnArgs = process.platform === "win32" ? [] : ["-i"];
    log(`[pty] Shell mode, spawning: ${spawnCmd}`);
  }

  let proc;
  try {
    proc = pty.spawn(spawnCmd, spawnArgs, {
      name: "xterm-color",
      cols,
      rows,
      cwd: sessionDir,
      env: ptyEnv,
    });
    if (!proc) {
      console.error("[pty] spawn returned null/undefined");
      ws.send(
        `\u001b[1;31m[server]\u001b[0m PTY spawn failed (no process)\r\n`
      );
      ws.close();
      cleanupSession(sessionId);
      return;
    }
    log(`[pty] Spawned: ${spawnCmd}, PID: ${proc.pid}`);
  } catch (err) {
    console.error(`[pty] Failed to spawn: ${spawnCmd}`, err);
    ws.send(`\u001b[1;31m[server]\u001b[0m Failed to spawn: ${spawnCmd}\r\n`);
    ws.close();
    cleanupSession(sessionId);
    return;
  }

  // Helper to reset idle timeout
  const resetIdleTimeout = () => {
    const session = activeSessions.get(sessionId);
    if (session?.idleTimer) {
      clearTimeout(session.idleTimer);
    }
    const timer = setTimeout(() => {
      log(`[session] Idle timeout reached for ${sessionId}`);
      ws.send(
        "\r\n\u001b[1;33m[server]\u001b[0m Session timed out due to inactivity.\r\n"
      );
      ws.close();
    }, SESSION_IDLE_TIMEOUT_MS);
    if (session) {
      session.idleTimer = timer;
    }
    return timer;
  };

  // Track active session with idle timer
  const idleTimer = resetIdleTimeout();
  activeSessions.set(sessionId, { ws, proc, idleTimer });

  // For auto-run mode: buffer output until we see the quarry banner
  let buffering = !!AUTO_RUN_CMD;
  let outputBuffer = "";
  const QUARRY_BANNER_MARKER = "██████";

  // Auto-run quarry command on connection (for page-load reset UX)
  if (QUARRY_MODE || AUTO_RUN_CMD) {
    const autoCmd = AUTO_RUN_CMD || "quarry";
    setTimeout(() => {
      proc.write("clear && " + autoCmd.trim() + "\n");
    }, 50);
  }

  const onData = (data: string) => {
    if (buffering) {
      outputBuffer += data;
      if (outputBuffer.includes(QUARRY_BANNER_MARKER)) {
        buffering = false;
        const bannerStart = outputBuffer.indexOf("\x1b[");
        const cleanOutput =
          bannerStart >= 0 ? outputBuffer.slice(bannerStart) : outputBuffer;
        if (ws.readyState === ws.OPEN) ws.send(cleanOutput);
        outputBuffer = "";
      }
    } else {
      if (ws.readyState === ws.OPEN) ws.send(data);
    }
    if (data && typeof data === "string" && data.trim()) {
      log(`[pty] data: ${data.slice(0, 80).replace(/\r|\n/g, " ")}`);
    }
  };
  proc.onData(onData);

  ws.on("message", (msg: Buffer) => {
    const text = msg.toString();
    log(`[ws] message: ${text.slice(0, 80)}`);
    resetIdleTimeout(); // Reset idle timer on any input
    try {
      const parsed = JSON.parse(text);
      if (
        parsed &&
        parsed.type === "input" &&
        typeof parsed.data === "string"
      ) {
        // Filter cd commands for security
        const filterResult = filterCdCommand(parsed.data, sessionDir);
        if (!filterResult.allowed) {
          if (filterResult.message && ws.readyState === ws.OPEN) {
            ws.send(filterResult.message);
          }
          return; // Block the command
        }
        proc.write(parsed.data);
        return;
      }
      if (
        parsed &&
        parsed.type === "resize" &&
        typeof parsed.cols === "number" &&
        typeof parsed.rows === "number"
      ) {
        proc.resize(parsed.cols, parsed.rows);
        return;
      }
      // For non-JSON messages, also filter
      const filterResult = filterCdCommand(text, sessionDir);
      if (!filterResult.allowed) {
        if (filterResult.message && ws.readyState === ws.OPEN) {
          ws.send(filterResult.message);
        }
        return;
      }
      proc.write(text);
    } catch (err) {
      console.error("[ws] failed to parse message as JSON", err);
      // For non-JSON messages, also filter
      const filterResult = filterCdCommand(text, sessionDir);
      if (!filterResult.allowed) {
        if (filterResult.message && ws.readyState === ws.OPEN) {
          ws.send(filterResult.message);
        }
        return;
      }
      proc.write(text);
    }
  });

  proc.onExit(({ exitCode, signal }: { exitCode: number; signal?: number }) => {
    log(`[pty] Process exited with code ${exitCode}, signal ${signal ?? 0}`);
    // Flush any buffered output before closing (shows errors if Quarry failed)
    if (outputBuffer.length > 0 && ws.readyState === ws.OPEN) {
      ws.send(outputBuffer);
      outputBuffer = "";
    }
    ws.close();
  });

  proc.on("error", (err: Error) => {
    console.error("[pty] error:", err);
    ws.close();
  });

  ws.on("close", () => {
    log(`[ws] Client disconnected, session: ${sessionId}`);
    const session = activeSessions.get(sessionId);
    if (session?.idleTimer) clearTimeout(session.idleTimer);
    try {
      proc.kill();
    } catch {
      // Ignore kill errors
    }
    activeSessions.delete(sessionId);
    // Clean up session directory after a short delay to allow pending file operations
    setTimeout(() => cleanupSession(sessionId), 1000);
  });

  ws.on("error", (err) => {
    console.error("[ws] error:", err);
    const session = activeSessions.get(sessionId);
    if (session?.idleTimer) clearTimeout(session.idleTimer);
    try {
      proc.kill();
    } catch {
      // Ignore kill errors
    }
    activeSessions.delete(sessionId);
    cleanupSession(sessionId);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`[terminal] Listening on http://${HOST}:${PORT}`);
  console.log(`[terminal] Output directory: ${path.resolve(OUTPUT_DIR)}`);
  console.log(`[terminal] Endpoints:`);
  console.log(`  - GET /health`);
  console.log(`  - GET /ws (WebSocket)`);
  console.log(`  - GET /files?session=<uuid>`);
  console.log(`  - GET /files/<filename>?session=<uuid>`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[terminal] SIGTERM received, shutting down...");
  // Clean up all active sessions
  for (const [sessionId, { proc, idleTimer }] of activeSessions) {
    if (idleTimer) clearTimeout(idleTimer);
    try {
      proc.kill();
    } catch {
      // Ignore kill errors during shutdown
    }
    cleanupSession(sessionId);
  }
  server.close(() => {
    console.log("[terminal] Server closed");
    process.exit(0);
  });
});
