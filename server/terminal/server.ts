const DEBUG =
  process.env.TERMINAL_DEBUG === "1" || process.env.TERMINAL_DEBUG === "true";
const log = (...args: any[]) => {
  if (DEBUG) console.log(...args);
};
if (DEBUG) console.log("BOOTSTRAP: server/terminal/server.ts starting");
import http from "http";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";
// node-pty is optional; require at runtime and handle absence gracefully
let pty: any = null;
try {
  pty = require("node-pty");
  log("[init] node-pty loaded");
} catch (err) {
  console.error("[init] node-pty failed to load", err);
  pty = null;
}

const PORT = parseInt(process.env.TERMINAL_PORT || "4000", 10);
const HOST = process.env.TERMINAL_HOST || "127.0.0.1";

// Quarry-only mode: spawn quarry interactive shell instead of bash
const QUARRY_MODE = process.env.TERMINAL_QUARRY_MODE === "true"; // must explicitly be "true"
const QUARRY_PATH = process.env.TERMINAL_QUARRY_PATH || "quarry"; // path to quarry binary
const AUTO_RUN_CMD = process.env.TERMINAL_AUTO_RUN || ""; // command to run on startup (e.g., "quarry\n")

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("not found");
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws: WebSocket, req) => {
  log(`[ws] connection from ${req.socket.remoteAddress}`);
  if (!pty) {
    console.error("[server] node-pty is unavailable. Terminal disabled.");
    ws.send(
      "\u001b[1;31m[server]\u001b[0m node-pty is unavailable. Terminal disabled.\r\n"
    );
    ws.close();
    return;
  }
  const cols = 80;
  const rows = 24;
  const ptyEnv = { ...process.env };

  // Determine what to spawn: quarry interactive mode or a shell
  let spawnCmd: string;
  let spawnArgs: string[];

  if (QUARRY_MODE) {
    // Spawn quarry in interactive mode
    spawnCmd = QUARRY_PATH;
    spawnArgs = []; // quarry starts in interactive mode by default
    log(`[pty] quarry mode enabled, spawning: ${spawnCmd}`);
  } else if (AUTO_RUN_CMD) {
    // Shell mode with auto-run: spawn bash -c with clear + command
    // This hides the initial prompt and runs the command cleanly
    spawnCmd = process.platform === "win32" ? "powershell.exe" : "bash";
    spawnArgs =
      process.platform === "win32"
        ? ["-Command", `cls; ${AUTO_RUN_CMD.trim()}`]
        : ["-c", `clear && ${AUTO_RUN_CMD.trim()}`];
    log(
      `[pty] shell with auto-run, spawning: ${spawnCmd} ${spawnArgs.join(" ")}`
    );
  } else {
    // Fallback to interactive shell (for development/testing)
    spawnCmd =
      process.platform === "win32"
        ? "powershell.exe"
        : process.env.SHELL || "bash";
    spawnArgs = [];
    log(`[pty] shell mode, spawning: ${spawnCmd}`);
  }

  let proc;
  try {
    proc = pty.spawn(spawnCmd, spawnArgs, {
      name: "xterm-color",
      cols,
      rows,
      cwd: process.env.TERMINAL_CWD || process.cwd(),
      env: ptyEnv,
    });
    if (!proc) {
      console.error("[pty] spawn returned null/undefined");
      ws.send(
        `\u001b[1;31m[server]\u001b[0m PTY spawn failed (no process)\r\n`
      );
      ws.close();
      return;
    }
    log(`[pty] spawned: ${spawnCmd}`);
  } catch (err) {
    console.error(`[pty] failed to spawn: ${spawnCmd}`, err);
    ws.send(
      `\u001b[1;31m[server]\u001b[0m Failed to spawn: ${spawnCmd}\r\n`
    );
    ws.close();
    return;
  }

  const onData = (data: string) => {
    if (ws.readyState === ws.OPEN) ws.send(data);
    if (data && typeof data === "string" && data.trim()) {
      log(`[pty] data: ${data.slice(0, 80).replace(/\r|\n/g, " ")}`);
    }
  };
  proc.onData(onData);

  ws.on("message", (msg: Buffer) => {
    const text = msg.toString();
    log(`[ws] message: ${text.slice(0, 80)}`);
    try {
      const parsed = JSON.parse(text);
      if (
        parsed &&
        parsed.type === "input" &&
        typeof parsed.data === "string"
      ) {
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
      proc.write(text);
    } catch (err) {
      console.error("[ws] failed to parse message as JSON", err);
      proc.write(text);
    }
  });

  proc.onExit(({ exitCode, signal }: { exitCode: number; signal: number }) => {
    log(`[pty] process exited with code ${exitCode}, signal ${signal}`);
    ws.close();
  });
  proc.on("error", (err: any) => {
    console.error("[pty] error:", err);
    ws.close();
  });

  ws.on("close", () => {
    log(`[ws] client disconnected`);
    try {
      proc.kill();
    } catch {}
  });
  ws.on("error", (err) => {
    console.error("[ws] error:", err);
    try {
      proc.kill();
    } catch {}
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[terminal] listening on http://${HOST}:${PORT}`);
});
