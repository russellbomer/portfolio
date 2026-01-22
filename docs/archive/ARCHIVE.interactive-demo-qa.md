# Interactive Demo QA Checklist

Use this guide to validate Section 2 of `deployment-checklist.md` before a release. Each subsection corresponds to a checkbox in the deployment checklist.

## Prerequisites

- Install dependencies: `npm install`
- Build patched `node-pty` on Windows if needed: `npm run pty:rebuild`
- Ensure `.env.local` (or environment secrets) includes:
  - `NEXT_PUBLIC_FEATURE_TERMINAL=true`
  - `NEXT_PUBLIC_TERMINAL_WS_URL=ws://127.0.0.1:4001/ws`
  - `TERMINAL_PORT=4001`
  - Optional: `TERMINAL_DEBUG=true` for verbose logging

## 1. `/demos` page renders without errors

1. Start Next.js in dev or production mode:
   ```powershell
   npm run dev
   # or
   npm run build; npm run start
   ```
2. Visit `http://localhost:3000/demos`.
3. Expected: page loads with at least one demo card and no console errors or hydration warnings.

## 2. Live PTY mode works locally

1. In a second terminal session:
   ```powershell
   $env:TERMINAL_PORT='4001'
   npm run dev:terminal
   ```
2. Health check:
   ```powershell
   Invoke-WebRequest http://127.0.0.1:4001/health
   ```
   Expected body: `ok`.
3. Refresh `/demos`.
4. Expected: the terminal banner shows `[client] connected to live terminal` and `Mode: Live`.
5. Type `ls` (or `dir` on Windows). Command output should stream in real time.

## 3. Graceful fallback to scripted demo

1. Stop the terminal server (Ctrl+C in the `npm run dev:terminal` shell).
2. Refresh `/demos`.
3. Expected:
   - UI displays `Mode: Demo (fallback)`.
   - Scripted walkthrough runs automatically.
   - Typing `help` returns the static list of commands.
   - No unhandled errors in the browser console.

## 4. WSS proxy validation (staging/production-like)

1. Deploy `server/terminal/server.ts` behind your reverse proxy (e.g., Nginx) with the `/ws` upgrade block described in `docs/terminal-demo.md`.
2. Set environment variables for the deployed Next.js app:
   ```bash
   NEXT_PUBLIC_FEATURE_TERMINAL=true
   NEXT_PUBLIC_TERMINAL_WS_URL=wss://<demo-domain>/ws
   ```
3. From a browser, open `/demos` on the staging host.
4. Expected:
   - Network tab shows the WebSocket handshake returning `101 Switching Protocols`.
   - Terminal stays in `Mode: Live` for at least 5 minutes without disconnecting.
5. Optional CLI verification:
   ```bash
   wscat -c wss://<demo-domain>/ws
   ```
   Send `{"type":"input","data":"ls\r"}` and check output.

## 5. Access strategy documentation

Decide who can access the live PTY in production and note the enforcement:

- **Public demo**: ensure commands are read-only and safe; monitor logs for abuse.
- **Restricted (recommended)**: gate behind IP allow-list, auth token, or feature flag disablement. Update `docs/terminal-demo.md` with the chosen approach.

## 6. Regression spot-check after changes

Whenever the terminal client or backend changes:

- Re-run Sections 1–3 in local dev.
- If proxy settings changed, repeat Section 4 on staging.
- Record date, tester, and findings in release notes or the sprint QA doc.

Maintaining this checklist helps keep the interactive demos reliable and reduces surprises during launch.

## 7. Performance metrics validation

Measure and document key performance indicators:

### LCP (Largest Contentful Paint)

1. Open Chrome DevTools → Lighthouse tab
2. Run Performance audit on `/demos/terminal`
3. Target: **< 1500ms**

### Cold start to "Mode: Live"

1. Open Chrome DevTools → Performance tab
2. Enable Screenshots, disable cache
3. Click reload button in Performance panel to record
4. Find timestamp when "Mode: Live" appears in screenshots
5. Target: **< 800ms**

### Performance Budgets

| Metric          | Target   | Notes                                 |
| --------------- | -------- | ------------------------------------- |
| LCP             | < 1500ms | Largest Contentful Paint on demo page |
| Cold start      | < 800ms  | Time from navigation to "Mode: Live"  |
| Demo error rate | < 1%     | WebSocket connection failures         |

## Verification Log

| Date       | Tester        | Environment      | Notes                                                                                 |
| ---------- | ------------- | ---------------- | ------------------------------------------------------------------------------------- |
| 2025-11-26 | Russell Bomer | Local (dev)      | `/demos` rendered, live PTY & fallback OK                                             |
| 2025-12-03 | Russell Bomer | Production (VPS) | LCP: 720ms ✅, Cold start: 167ms (no throttle) / 533ms (4x CPU) ✅. All metrics pass. |
