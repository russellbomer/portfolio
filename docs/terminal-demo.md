# Terminal Demo / WebSocket PTY

This document captures how to run, debug, and expose the feature‑flagged terminal demo both locally and behind TLS.

## Overview

The demo uses:

- Optional `node-pty` backend (graceful fallback if build fails)
- A lightweight HTTP + WebSocket server in `server/terminal/server.ts`
- Frontend xterm.js client component at `components/demo/TerminalDemo.tsx`
- Feature flag + URL environment variables to toggle and point the client

## Core Environment Variables

| Variable                       | Scope    | Default                  | Purpose                                                      |
| ------------------------------ | -------- | ------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_FEATURE_TERMINAL` | Frontend | `false`                  | Enables the live terminal feature in the UI when `true`/`1`. |
| `NEXT_PUBLIC_TERMINAL_WS_URL`  | Frontend | `ws://127.0.0.1:4000/ws` | WebSocket endpoint the xterm client connects to.             |
| `TERMINAL_PORT`                | Backend  | `4000`                   | Port the terminal server listens on.                         |
| `TERMINAL_HOST`                | Backend  | `127.0.0.1`              | Host/interface for the terminal server.                      |
| `TERMINAL_SHELL`               | Backend  | Platform dependent       | Overrides shell (e.g. `bash`, `powershell.exe`).             |
| `TERMINAL_DEBUG`               | Backend  | unset                    | When `true`/`1`, verbose PTY + WS logging is emitted.        |

For convenience a `.env.local` file has been added containing:

```
NEXT_PUBLIC_FEATURE_TERMINAL=true
NEXT_PUBLIC_TERMINAL_WS_URL=ws://127.0.0.1:4001/ws
TERMINAL_PORT=4001
# TERMINAL_DEBUG=true   # Uncomment to enable verbose logging
```

## Local Development

```powershell
# Start the terminal backend (quiet mode)
npm run dev:terminal

# Or with verbose logging
env TERMINAL_DEBUG=true npm run dev:terminal  # PowerShell: $env:TERMINAL_DEBUG='true'; npm run dev:terminal

# Start Next.js (reads .env.local)
npm run dev

# Visit
http://localhost:3000/demos
```

When connected you will see a green `[client] connected to live terminal` banner. If the backend is unavailable or `node-pty` fails to load the UI transparently falls back to demo script mode.

## Rebuilding `node-pty` (Windows)

If native module build fails:

```powershell
npm run pty:rebuild
```

This script applies Windows patches and invokes a rebuild. After success restart `npm run dev:terminal`.

## Health Check

Backend exposes `GET /health` responding with `ok` for monitoring. No auth required (consider gating in production).

## TLS / Reverse Proxy (Nginx)

To serve the WebSocket endpoint over `wss://`, Nginx must forward upgrade requests. The repo includes a template: `deploy/nginx/sites-available/portfolio.conf`.

Added `location /ws` blocks (root + wildcard):

```nginx
location /ws {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:4001/ws;
}
```

Adjust `127.0.0.1:4001` if your terminal server runs elsewhere. For isolation you can define an upstream:

```nginx
upstream terminal_ws { server 127.0.0.1:4001; }
location /ws { proxy_pass http://terminal_ws/ws; ... }
```

### Testing WSS

1. Ensure terminal server running (`TERMINAL_PORT=4001`).
2. Deploy / reload Nginx config and restart Nginx.
3. Set frontend env:
   ```powershell
   $env:NEXT_PUBLIC_TERMINAL_WS_URL='wss://demo.russellbomer.com/ws'
   ```
4. Load `/demos`; verify Mode shows `Live` and no fallback message.
5. Inspect browser devtools Network tab; WS connection should remain `101 Switching Protocols`.

### Common Issues

| Symptom                       | Cause                        | Fix                                              |
| ----------------------------- | ---------------------------- | ------------------------------------------------ |
| Browser closes with code 1006 | Missing Upgrade headers      | Confirm `location /ws` block present & reloaded. |
| Fallback to demo mode         | Port mismatch or server down | Align `TERMINAL_PORT` & URL; check `/health`.    |
| `node-pty` error on Windows   | Build toolchain missing      | Install build tools; run `npm run pty:rebuild`.  |
| High log noise                | Debug mode enabled           | Remove/clear `TERMINAL_DEBUG` env.               |

## Observability / Logging

Verbose logging (PTY output, WS frames) only appears when `TERMINAL_DEBUG=true`. Keep disabled in production to avoid leaking sensitive shell output.

## Future Hardening Ideas

- Authenticated tokens to open WS sessions
- Idle timeout enforcement server-side
- Replay capture for demo fallback pre-render
- Resource limiting (CPU / memory quotas if containerized)

## Quick Checklist

- [x] Live PTY works locally
- [x] Feature flag gating in place
- [x] Demo fallback graceful
- [x] Logging toggle
- [ ] WSS proxy validated in staging
- [ ] Access controls (future)

---

Last updated: 2025-11-24
