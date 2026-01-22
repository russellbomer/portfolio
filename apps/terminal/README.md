# Terminal Backend (PTY + WebSocket)

A minimal Node HTTP + WebSocket bridge that powers the interactive terminal demo.

> **⚠️ Windows Limitation:** `node-pty` fails to compile on Windows due to native C++ module issues. The scripted demo fallback works on Windows for local development. Live PTY mode requires deployment to Linux (VPS).

## Endpoints

- `GET /health` → `200 ok`
- `GET /ws` → WebSocket upgrade; streams PTY output and accepts input/resize messages
- `GET /files?session=<uuid>` → List files in session directory (JSON)
- `GET /files/<filename>?session=<uuid>` → Download specific file

## Server Environment Variables

| Variable               | Default                | Description                    |
| ---------------------- | ---------------------- | ------------------------------ |
| `TERMINAL_HOST`        | `127.0.0.1`            | Bind address                   |
| `TERMINAL_PORT`        | `4000`                 | HTTP/WebSocket port            |
| `TERMINAL_OUTPUT_DIR`  | `./data/quarry-output` | Session file storage           |
| `TERMINAL_DEBUG`       | `false`                | Enable verbose logging         |
| `TERMINAL_QUARRY_MODE` | `false`                | Spawn quarry instead of shell  |
| `TERMINAL_QUARRY_PATH` | `quarry`               | Path to quarry binary          |
| `TERMINAL_AUTO_RUN`    | ``                     | Command to auto-run on connect |

## Client Feature Flags (Next.js)

- `NEXT_PUBLIC_FEATURE_TERMINAL` (`true|false`) — enables the live terminal client wiring
- `NEXT_PUBLIC_TERMINAL_WS_URL` — WebSocket endpoint, e.g. `ws://127.0.0.1:4001/ws`

## Quick Start (Local)

```powershell
# 1) Start the PTY server (4001 avoids conflicts)
$env:TERMINAL_PORT='4001'
npm run dev:terminal

# 2) In a new terminal, run the Next dev server
$env:NEXT_PUBLIC_FEATURE_TERMINAL='true'
$env:NEXT_PUBLIC_TERMINAL_WS_URL='ws://127.0.0.1:4001/ws'
npm run dev
```

## WebSocket Protocol

### Client → Server Messages

```json
{"type":"input","data":"ls\r"}
{"type":"resize","cols":120,"rows":32}
```

### Server → Client Messages

```json
{ "type": "session", "id": "550e8400-e29b-41d4-a716-446655440000" }
```

Plus raw PTY text frames (UTF-8) for terminal output.

## File Download API

### Session Lifecycle

1. **Connect**: WebSocket connection generates UUID session ID
2. **Directory Created**: `/data/quarry-output/<session-id>/`
3. **Session Message**: Server sends `{"type":"session","id":"<uuid>"}` to client
4. **Files Generated**: Quarry writes to session directory
5. **Disconnect**: Session directory is cleaned up (1 second delay)

### List Files

```
GET /files?session=<uuid>

Response 200:
{
  "files": [
    {"name": "output.json", "size": 1234, "modified": "2025-12-03T10:00:00.000Z"},
    {"name": "report.csv", "size": 5678, "modified": "2025-12-03T10:01:00.000Z"}
  ]
}
```

### Download File

```
GET /files/output.json?session=<uuid>

Response 200:
Content-Type: application/json
Content-Disposition: attachment; filename="output.json"
<file contents>
```

### Allowed File Types

| Extension | MIME Type          |
| --------- | ------------------ |
| `.json`   | `application/json` |
| `.csv`    | `text/csv`         |
| `.html`   | `text/html`        |
| `.txt`    | `text/plain`       |
| `.md`     | `text/markdown`    |

### Limits

- **Max file size**: 10MB per file
- **Max session storage**: 50MB per session (enforced, with 80% warning)
- **Session idle timeout**: 15 minutes of inactivity
- Files outside session directory are inaccessible

### Security

- Session IDs are UUID v4 (cryptographically random)
- Filenames are sanitized (alphanumeric, dots, hyphens, underscores only)
- Path traversal attacks are blocked
- Files are only accessible with valid session ID

---

## Security Model

The terminal demo runs untrusted user commands in a sandboxed Docker container with multiple layers of defense:

### Container Isolation

| Layer                       | Protection                                                    |
| --------------------------- | ------------------------------------------------------------- |
| **Non-root user**           | Container runs as `quarry` (UID 1000), not root               |
| **Read-only rootfs**        | `read_only: true` prevents filesystem modifications           |
| **Tmpfs mounts**            | Writable areas are ephemeral RAM disks with size limits       |
| **Capability dropping**     | `cap_drop: ALL` with minimal add-back (CHOWN, SETUID, SETGID) |
| **No privilege escalation** | `no-new-privileges: true` security option                     |
| **Resource limits**         | CPU: 0.5 cores, Memory: 512MB, Tmpfs: 320MB total             |
| **Network isolation**       | Bridge network, no exposed ports, outbound HTTP only          |

### Session Security

| Control               | Implementation                                   |
| --------------------- | ------------------------------------------------ |
| **Session isolation** | Each connection gets unique UUID directory       |
| **Idle timeout**      | 15 minutes of inactivity triggers disconnect     |
| **Storage limits**    | 50MB per session, 10MB per file                  |
| **Auto cleanup**      | Session directory deleted on disconnect          |
| **Daily reset**       | Container restart at 04:00 clears all tmpfs data |

### File Download Security

| Control                   | Implementation                                                          |
| ------------------------- | ----------------------------------------------------------------------- |
| **Path traversal**        | `path.resolve()` + prefix check blocks `../` attacks                    |
| **Filename sanitization** | Regex allows only `[\w.-]+` characters                                  |
| **Extension whitelist**   | Only `.json`, `.jsonl`, `.csv`, `.html`, `.txt`, `.md`, `.yml`, `.yaml` |
| **Size limits**           | 10MB per file, 50MB per session                                         |
| **Session binding**       | Files require valid session UUID to access                              |

### Filesystem Navigation Guardrails

The terminal server implements command-level filtering to prevent casual directory traversal attempts:

| Command Pattern   | Blocked? | Reason                                       |
| ----------------- | -------- | -------------------------------------------- |
| `cd ..`           | ✅ Yes   | Parent directory navigation                  |
| `cd ../..`        | ✅ Yes   | Multi-level parent traversal                 |
| `cd /`            | ✅ Yes   | Absolute path to root                        |
| `cd /etc`         | ✅ Yes   | Any absolute path                            |
| `cd ~/something`  | ✅ Yes   | Home directory reference (could escape)      |
| `cd subdirectory` | ❌ No    | Relative navigation within session           |
| `ls /etc`         | ❌ No    | Non-cd commands not filtered (Docker limits) |
| `mkdir test`      | ❌ No    | File operations within session are allowed   |

**Rationale:**

- Primary security: Docker container isolation (read-only rootfs, non-root user, no caps)
- Secondary defense: Command filtering prevents casual/accidental escapes
- Not designed to block adversarial attacks (container isolation handles that)
- Users stay in their session directory for cleaner UX and privacy between sessions

**Limitations:**

- Only `cd` commands are filtered at PTY input level
- Symlinks and absolute paths in other commands still work (container prevents actual damage)
- Advanced users could theoretically browse container filesystem (but can't modify or escape)

**Tested Escape Attempts (Blocked):**

- `cd ..`, `cd ../..`, `cd ../../..`
- `cd /`, `cd /etc`, `cd /home`
- `cd /home/quarry` (parent of session directory)
- `cd ~/` (home directory reference)

**Normal Operations (Allowed):**

- `cd schemas` (relative subdirectory)
- `cd data/out` (nested relative path)
- `pwd` (print working directory)
- File operations within session: `touch`, `mkdir`, `cat`, `ls`, etc.

All blocked attempts are logged server-side for monitoring and debugging.

### Attack Surface Analysis

| Vector              | Mitigation                                            |
| ------------------- | ----------------------------------------------------- |
| Container escape    | No privileged mode, no docker.sock, no SYS_ADMIN cap  |
| Resource exhaustion | CPU/memory limits, tmpfs caps, session timeout        |
| Data exfiltration   | Session isolation, auto-cleanup, no persistence       |
| Network abuse       | Outbound only, no exposed ports, rate limits at nginx |
| Path traversal      | Triple validation: sanitize + resolve + prefix check  |

## Frontend Integration

- The UI lives in `components/demo/TerminalDemo.tsx`
- File downloads via `components/demo/FileDownloader.tsx`
- When the feature flag is enabled and the WS server is reachable, the client connects to live PTY mode
- If `node-pty` is unavailable or the socket closes, the component degrades to a scripted demo
- Demo commands: `help`, `clear`, `replay`

## Windows Native Build (node-pty)

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
