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
const DEFAULT_SHELL =
  process.env.TERMINAL_SHELL ||
  (process.platform === "win32"
    ? "powershell.exe"
    : process.env.SHELL || "bash");

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

  const shell = DEFAULT_SHELL;
  log(`[pty] resolved shell: ${shell}`);
  let proc;
  try {
    proc = pty.spawn(shell, [], {
      name: "xterm-color",
      cols,
      rows,
      cwd: process.cwd(),
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
    log(`[pty] spawned shell: ${shell}`);
  } catch (err) {
    console.error(`[pty] failed to spawn shell: ${shell}`, err);
    ws.send(
      `\u001b[1;31m[server]\u001b[0m Failed to spawn shell: ${shell}\r\n`
    );
    ws.close();
    return;
  }

  ws.send("\u001b[1;32m[server]\u001b[0m PTY started\r\n");

  const onData = (data: string) => {
    if (ws.readyState === ws.OPEN) ws.send(data);
    // Log a snippet of PTY output for debugging
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
    try {
      ws.send(
        `\r\n\u001b[1;31m[server]\u001b[0m PTY exited (code ${exitCode}, signal ${signal})\r\n`
      );
    } catch {}
    ws.close();
  });
  proc.on("error", (err: any) => {
    console.error("[pty] error:", err);
    try {
      ws.send(
        `\r\n\u001b[1;31m[server]\u001b[0m PTY error: ${
          err?.message || err
        }\r\n`
      );
    } catch {}
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
