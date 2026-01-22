# STATUS.md

Single source of truth for progress. Update this file at the end of every stage.

## Current state
- Branch: main
- Worktree (optional): ______________________
- Current stage: Stage 2 (COMPLETED)

## Completed stages
| Stage | Name | Commit | Notes |
|------:|------|--------|-------|
| 0 | Baseline docs + tracking | (skipped) | Docs added directly to main |
| 1 | Repo hygiene + secret remediation prep | e92e6bc | .env.production untracked; purge script + runbook added; history purge completed |
| 2 | Monorepo layout | 4334492 | Moved Next.js to apps/portfolio, terminal to apps/terminal; npm workspaces |
| 3 | Portfolio hardening | ________ | |
| 4 | Terminal hardening (no host shell + per-session sandbox) | ________ | |
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

## Open questions / risks
- [ ] Was the terminal service ever spawning `bash` on the host (vs container-only)?
- [ ] Will the terminal server require docker.sock access? If yes, decide acceptable risk + mitigation.
- [ ] Is the portfolio truly static (no request-time SSR needed), aside from terminal client integration?

## Next action (agent-owned)
- Stage 3: Portfolio hardening

## Evidence / checks (paste outputs as links or short notes)
- Stage 2 build check: `apps/portfolio` npm ci && npm run build ✓ (13 pages); `apps/terminal` npm ci && npm run lint ✓
- Stage 4 “prove it” grep checks:
  - NO bash spawn: (output summary)
  - network none present: (output summary)
  - no privileged/host/docker.sock: (output summary)
