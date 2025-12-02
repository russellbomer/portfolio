# Terminal Backend (PTY + WebSocket)

A minimal Node HTTP + WebSocket bridge that powers the interactive terminal demo.

> **⚠️ Windows Limitation:** `node-pty` fails to compile on Windows due to native C++ module issues. The scripted demo fallback works on Windows for local development. Live PTY mode requires deployment to Linux (VPS).

- HTTP health: `GET /health` → `200 ok`
- WebSocket: `GET /ws` → upgrade; streams PTY output and accepts input/resize messages

Server environment variables:

- `TERMINAL_HOST` (default `127.0.0.1`)
- `TERMINAL_PORT` (default `4000`)
- `TERMINAL_SHELL` (default `powershell.exe` on Windows, else `$SHELL` or `bash`)

Client feature flags (Next.js):

- `NEXT_PUBLIC_FEATURE_TERMINAL` (`true|false`) — enables the live terminal client wiring
- `NEXT_PUBLIC_TERMINAL_WS_URL` — WebSocket endpoint, e.g. `ws://127.0.0.1:4001/ws`

Quick start (local):

```powershell
# 1) Start the PTY server (4001 avoids conflicts)
$env:TERMINAL_PORT='4001'
npm run dev:terminal

# 2) In a new terminal, run the Next dev server
$env:NEXT_PUBLIC_FEATURE_TERMINAL='true'
$env:NEXT_PUBLIC_TERMINAL_WS_URL='ws://127.0.0.1:4001/ws'
npm run dev
```

WebSocket protocol (initial):

- Client → Server: `{"type":"input","data":"ls\r"}`
- Client → Server: `{"type":"resize","cols":120,"rows":32}`
- Server → Client: raw PTY text frames (UTF-8)

Frontend integration and fallback:

- The UI lives in `components/demo/TerminalDemo.tsx`.
- When the feature flag is enabled and the WS server is reachable, the client connects to live PTY mode.
- If `node-pty` is unavailable or the socket closes, the component degrades to a scripted demo with an input buffer and prompt.
- Demo commands: `help`, `clear`, `replay`.

Windows native build workflow (node-pty):

`node-pty` is an optional dependency. Installs succeed even if the native addon fails to build; in that case the server disables itself gracefully. To enable PTY on Windows:

1. Install toolchain

- "Visual Studio 2022 Build Tools" with MSVC v143 (x86/x64), Spectre‑mitigated libs
- Windows SDK 10/11 (recent)

2. Patch-before-build scripts

```powershell
# Fetch node-pty without running its install scripts, apply fixes, then build
npm run pty:prepare

# If node-pty is already present, re-apply fixes and rebuild
npm run pty:rebuild
```

The helper `scripts/patches/fix-node-pty-windows.js` currently:

- Injects missing ConPTY PFN typedefs (fixes errors like `PFNCREATEPSEUDOCONSOLE` undeclared)
- Hoists winpty variable declarations in `winpty.cc` to avoid MSVC C2362 ("initialization is skipped by goto")

Troubleshooting

- EADDRINUSE on startup: another process has port 4000. Set `TERMINAL_PORT` to a free port, e.g. 4001.
- ConPTY PFN typedef errors (PFNCREATE/RESIZE/etc. undeclared): run `npm run pty:rebuild` to re-inject typedef guards.
- MSVC C2362 errors in `winpty.cc`: run `npm run pty:rebuild` so the hoist fix is applied before rebuilding.
- Verify server health: `http://127.0.0.1:<port>/health` should return `ok`.

Notes

- The terminal backend is separate from Next.js API routes to simplify `node-pty` usage and WS proxying in production.
- In production, front the service with TLS and set `NEXT_PUBLIC_TERMINAL_WS_URL` to `wss://.../ws`.
