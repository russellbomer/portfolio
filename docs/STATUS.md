# STATUS.md

Single source of truth for progress. Update this file at the end of every stage.

## Current state
- Branch: infra/split-vercel-terminal
- Worktree (optional): ______________________
- Current stage: Stage 1 COMPLETE — ready for Stage 2

## Completed stages
| Stage | Name | Commit | Notes |
|------:|------|--------|-------|
| 0 | Baseline docs + tracking | 01eb8f9 | Combined with Stage 1 |
| 1 | Repo hygiene + secret remediation prep | 01eb8f9 | .env.production untracked; purge script ready (not run) |
| 2 | Monorepo layout | ________ | |
| 3 | Portfolio hardening | ________ | |
| 4 | Terminal hardening (no host shell + per-session sandbox) | ________ | |
| 5 | Terminal deploy artifacts (compose/systemd/nginx) | ________ | |
| 6 | Vercel config | (MANUAL) | |
| 7 | DO rebuild + DNS | (MANUAL) | |
| 8 | Decommission old droplet | (MANUAL) | |

## Pending MANUAL steps (human-owned)
(See `docs/MANUAL_STEPS.md` for the authoritative checklist.)
- [ ] Rotate leaked DB credential(s)
- [ ] Decide on history purge; if yes, run filter-repo + force push
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
- Stage 2: Convert repo to monorepo layout (apps/portfolio + apps/terminal)

## Evidence / checks (paste outputs as links or short notes)
- Stage 1 checks:
  - `.env.production` untracked: `git ls-files '.env*'` returns only `.env.example`
  - `scripts/purge-secret.sh` exists and is executable (NOT run)
  - `docs/secret-remediation.md` runbook created
- Stage 2 build check: (link/summary)
- Stage 4 “prove it” grep checks:
  - NO bash spawn: (output summary)
  - network none present: (output summary)
  - no privileged/host/docker.sock: (output summary)
