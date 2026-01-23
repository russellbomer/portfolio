# STATUS.md

Single source of truth for progress. Update this file at the end of every stage.

## Current state
- Branch: main
- Worktree (optional): ______________________
- Current stage: Stage 4C (COMPLETED)

## Completed stages
| Stage | Name | Commit | Notes |
|------:|------|--------|-------|
| 0 | Baseline docs + tracking | (skipped) | Docs added directly to main |
| 1 | Repo hygiene + secret remediation prep | e92e6bc | .env.production untracked; purge script + runbook added; history purge completed |
| 2 | Monorepo layout | 4334492 | Moved Next.js to apps/portfolio, terminal to apps/terminal; npm workspaces |
| 3 | Portfolio hardening | a9931af | Pinned next@15.5.9 (removed canary); removed experimental.ppr/clientSegmentCache/nodeMiddleware |
| 4A | Terminal hardening (no host shell + per-session sandbox) | c04d8f5 | Removed node-pty; added sandboxRunner with dockerode; per-session containers with --network none, read-only, cap-drop ALL |
| 4B | Terminal abuse controls (token gating + rate limits) | c9ccb71 | Added POST /session, token-gated WS, per-IP rate limits; MANUAL: set TOKEN_SECRET on droplet |
| 4C | Terminal host validation | bf10e8d | Nginx: server_name=quarry.russellbomer.com, 444 for unknown hosts; App: ALLOWED_HOSTS config + isHostAllowed() validation |
| 5 | Terminal deploy artifacts (compose/systemd/nginx) | ________ | |
| 6 | Vercel config | (MANUAL) | |
| 7 | DO rebuild + DNS | (MANUAL) | |
| 8 | Decommission old droplet | (MANUAL) | |

## Pending MANUAL steps (human-owned)
(See `docs/MANUAL_STEPS.md` for the authoritative checklist.)
- [x] ~~Rotate leaked DB credential(s)~~ (completed 2026-01-22)
- [x] ~~Decide on history purge; if yes, run filter-repo + force push~~ (completed 2026-01-22)
- [ ] Create new GitHub deploy key for terminal droplet; remove old keys
- [ ] Create Vercel project; set Root Directory = `apps/portfolio`
- [ ] DNS: apex/www → Vercel; quarry subdomain → new droplet IP
- [ ] Create new DO droplet + firewall; harden SSH; provision TLS
- [ ] Destroy compromised droplet; revoke/rotate DO/GitHub tokens
- [ ] Set TOKEN_SECRET on droplet: `export TOKEN_SECRET=$(openssl rand -hex 32)`

## Open questions / risks
- [x] ~~Was the terminal service ever spawning `bash` on the host (vs container-only)?~~ Resolved: Stage 4A removed all host shell spawning
- [ ] Will the terminal server require docker.sock access? If yes, decide acceptable risk + mitigation.
- [ ] Is the portfolio truly static (no request-time SSR needed), aside from terminal client integration?

## Next action (agent-owned)
- Stage 5: Terminal deploy artifacts (compose/systemd/nginx)

## Evidence / checks (paste outputs as links or short notes)
- Stage 2 build check: `apps/portfolio` npm ci && npm run build ✓ (13 pages); `apps/terminal` npm ci && npm run lint ✓
- Stage 3 checks: npm ci ✓, npm run build ✓ (13 static pages), npm audit (4 moderate in drizzle-kit deps, pre-existing), no canary in lockfile ✓
- Stage 4A "prove it" grep checks:
  - NO bash spawn: `rg "spawn.*bash|bash -c|exec\(|execSync\("` → no matches ✓
  - network none present: `rg "NetworkMode.*none"` → sandboxRunner.ts:101 ✓
  - no privileged/host/docker.sock: `rg "privileged.*true|network_mode.*host|docker\.sock"` → no matches ✓
  - npm install + lint: 0 vulnerabilities, lint passes ✓
- Stage 4B checks:
  - npm ci: 0 vulnerabilities ✓
  - npm run lint: passes ✓
  - New files: config.ts, tokenManager.ts, rateLimiter.ts
  - POST /session endpoint added ✓
  - WS requires token (?token=...) ✓
  - Rate limits: per-IP concurrent (2), connections/min (10), msg/sec (30) ✓
- Stage 4C checks:
  - npm ci: 0 vulnerabilities ✓
  - npm run lint: passes ✓
  - Nginx server_name: `server_name quarry.russellbomer.com;` (lines 33, 41) ✓
  - Default server returns 444: `return 444;` (line 26) ✓
  - App ALLOWED_HOSTS: defaults to "quarry.russellbomer.com" (config.ts:55) ✓
  - App isHostAllowed(): validates Host header in HTTP (line 355) and WS (line 466) handlers ✓
  - Invalid hosts rejected: HTTP 403 "Forbidden: Invalid Host header", WS close code 4003 ✓
