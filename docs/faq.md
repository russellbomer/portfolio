# FAQ

A quick reference for common questions and issues in this repository. For the interactive terminal demo’s full guide, see `server/terminal/README.md`.

## Contact Email

- How do I enable email sending from the contact form?
  - Configure SMTP and recipients via environment variables, then deploy/restart:
    - `SMTP_HOST` (e.g. `smtp.sendgrid.net`)
    - `SMTP_PORT` (e.g. `587`)
    - `SMTP_SECURE` (`true|false`, usually `false` for 587)
    - `SMTP_USER` (username, if required)
    - `SMTP_PASS` (password/API key, if required)
    - `CONTACT_EMAIL_FROM` (from address, e.g. `"Portfolio" <contact@russellbomer.com>`)
    - `CONTACT_EMAIL_TO` (destination address, e.g. `contact@russellbomer.com`)
  - The API route `POST /api/contact` uses these to send via Nodemailer.
- Quick local test (PowerShell):
  - Set envs and submit the contact form in the UI; watch server logs for send results.

## Terminal Demo

- What flags enable the live terminal?
  - Set `NEXT_PUBLIC_FEATURE_TERMINAL=true` and `NEXT_PUBLIC_TERMINAL_WS_URL=ws://127.0.0.1:<port>/ws`.
- How do I run the backend locally?
  - In PowerShell: set `TERMINAL_PORT` (e.g. `4001`) and run `npm run dev:terminal`. Health: `GET http://127.0.0.1:<port>/health` → `ok`.
- It says EADDRINUSE on port 4000.
  - Another process is using that port. Set `TERMINAL_PORT` to a free port like `4001` and start the server again.
- Windows build errors: PFN typedefs (ConPTY) or MSVC C2362 in `winpty.cc`.
  - Run `npm run pty:rebuild` to apply compatibility patches and rebuild `node-pty`. Ensure VS Build Tools 2022 (MSVC v143 + Spectre) and a recent Windows SDK are installed.
- Why is `node-pty` optional?
  - Installs should not be blocked by native build failures. When absent or failing to load, the terminal gracefully degrades to a scripted demo.
- How do I disable the live terminal?
  - Set `NEXT_PUBLIC_FEATURE_TERMINAL=false` or unset `NEXT_PUBLIC_TERMINAL_WS_URL`. The demo fallback remains available.
- Do I need to proxy the backend in production?
  - Yes, front it with TLS and set `NEXT_PUBLIC_TERMINAL_WS_URL` to a `wss://.../ws` endpoint. The backend is a separate Node service.

## General

- Where are the theme tokens?
  - See `portfolio-theme-final.json` and `components/theme/*`.
- How do I regenerate the sitemap?
  - `npm run postbuild` triggers the script, or run `node scripts/generate-sitemap.mjs` manually.
- Where are the demos wired?
  - See `components/demo/*` and `app/demos/page.tsx`.
