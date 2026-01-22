Below is a source-of-truth implementation plan you can hand to a CLI coding agent (Claude Code). It’s structured as staged work packages with explicit deliverables, commands, and acceptance criteria. Anything that touches credentials, accounts, DNS, or infrastructure controls is marked **MANUAL (YOU)**.

---

# Source-of-truth implementation plan (Portfolio on Vercel + Terminal Demo on isolated DO droplet)

## Global guardrails for the agent
- Do not print or log secrets. If a secret is needed, use placeholders and instruct **MANUAL (YOU)** to supply it.
- Do not attempt to access external accounts (GitHub/Vercel/DigitalOcean/Hostinger). Only prepare config/files/commands.
- Prefer deterministic version pinning and explicit config over “auto-fix everything.”
- Avoid `canary` Next.js releases for production.

---

## Stage 0 — Create a clean working baseline (repo safety)
**Agent actions**
1) Create a new branch:
```bash
git checkout -b infra/split-vercel-terminal
```

2) Add a repo-level `SECURITY.md` note (brief) stating:
- terminal demo is hostile-facing
- never spawn a shell
- per-session containers with no network
- never commit secrets / `.env*`

**Deliverables**
- PR-ready branch with only non-breaking documentation changes.

**Acceptance criteria**
- Branch created; no functional changes yet.

---

## Stage 1 — Repo hygiene and secret remediation
### 1A) Stop tracking production env files (optional but recommended)
Your `.env.production` currently contains only public config, but keeping `.env*` tracked is a foot-gun.

**Agent actions**
1) Add `.env*` patterns to `.gitignore`, but keep a tracked example file:
- Create `.env.production.example` containing:
  - `BASE_URL=...`
  - `NEXT_PUBLIC_TERMINAL_WS_URL=...`
  - `NEXT_PUBLIC_FEATURE_TERMINAL=true`

2) Remove `.env.production` from tracking (keep local file if needed):
```bash
git rm --cached .env.production
```

3) Update docs/README to reference `.env.production.example`.

**Deliverables**
- `.env.production.example` added
- `.env.production` untracked
- `.gitignore` updated

**Acceptance criteria**
- `git status` shows `.env.production` is no longer tracked.
- Build still works locally when `.env.production` exists locally.

---

### 1B) Remove leaked credential from repo history (high sensitivity)
Your audit report says `.agent/handoff.md` contains a plaintext DB password.

**MANUAL (YOU)**
- Rotate the DB password / credential wherever it is used (DB, service, etc.).
- Decide whether you want to purge history. If the repo is public, you should.

**Agent actions (prepare, but do NOT execute rewrite unless you explicitly run it)**
1) Create a helper script `scripts/purge-secret.sh` that uses `git filter-repo` to remove:
- the file `.agent/handoff.md` entirely from history, OR
- the specific secret string replacement

Example (file removal approach is simplest):
```bash
#!/usr/bin/env bash
set -euo pipefail
git filter-repo --path .agent/handoff.md --invert-paths
echo "History rewritten. Force-push will be required."
```

2) Add a `docs/secret-remediation.md` with exact steps:
- install `git-filter-repo`
- run the script
- force-push
- coordinate with any clones/forks

**Deliverables**
- `scripts/purge-secret.sh`
- `docs/secret-remediation.md`

**Acceptance criteria**
- Script exists and is not run automatically.

**MANUAL (YOU)**
- Run the purge, then force push:
```bash
# only if you choose to purge
bash scripts/purge-secret.sh
git push --force --all
git push --force --tags
```
- Then rotate any other secrets that may have been exposed.

---

## Stage 2 — Convert repo to monorepo layout (portfolio vs terminal)
Goal: Vercel deploys only portfolio app; droplet deploys only terminal service.

**Target layout**
```
apps/
  portfolio/        # Next.js app
  terminal/         # WS server + sandbox runner + nginx conf + docker assets
deploy/             # optional, or moved under apps/terminal
packages/           # optional shared libs
```

**Agent actions**
1) Identify current locations:
- Next.js app root (likely repo root)
- terminal server code (per summary: `server/terminal/server.ts`)
- nginx config (`deploy/nginx/...`)
- docker compose (`deploy/docker/docker-compose.yml`)

2) Move files:
- Move Next.js code into `apps/portfolio/` (preserve git history with `git mv`).
- Move terminal server and deployment assets into `apps/terminal/`.

3) Update import paths and build scripts:
- Ensure `apps/portfolio/package.json` has correct scripts for Next build.
- Ensure `apps/terminal/package.json` has scripts for terminal server.

4) Add root-level workspace tooling only if needed (optional):
- If using npm workspaces:
  - root `package.json` with `"workspaces": ["apps/*"]`
- Otherwise keep each app independent.

**Deliverables**
- Monorepo structure with correct paths
- Updated package.json scripts and references

**Acceptance criteria**
- `cd apps/portfolio && npm ci && npm run build` succeeds
- `cd apps/terminal && npm ci && npm run lint` (or build) succeeds

---

## Stage 3 — Portfolio app hardening + dependency pinning
**Agent actions**
1) Remove canary usage and pin stable Next version.
- Update `apps/portfolio/package.json` to stable Next (e.g., `15.5.9` if that’s your chosen patched target).
- Run:
```bash
cd apps/portfolio
npm install next@15.5.9
npm install
npm audit
```

2) Ensure terminal demo code in portfolio is purely client integration:
- `NEXT_PUBLIC_TERMINAL_WS_URL` consumed only by client terminal component.
- No server actions used for terminal session creation unless you deliberately want that.

3) Add a “safe fallback” mode:
- If WS is down, fallback demo script mode remains.

**Deliverables**
- Updated Next dependency versions and lockfile
- No canary versions in portfolio

**Acceptance criteria**
- Portfolio build succeeds locally
- No Next canary in `package-lock.json`

---

## Stage 4 — Terminal service redesign: make Docker sandbox mandatory, remove bash
This is the most important hardening stage.

### 4A) Enforce “no host shell”
**Agent actions**
1) Modify `apps/terminal/server/terminal/server.ts` (or equivalent) so that:
- It does NOT spawn `bash` on the host.
- It does NOT run user input through a shell.
- It does NOT pass raw user input into a command string.

2) Implement a per-session sandbox runner that launches a container for each session:
- Use `docker run --rm` (or equivalent Docker API)
- Attach stdin/stdout to the WS session
- Session directory mounted into container

3) Container must run with:
- `--network none`
- `--read-only`
- `--cap-drop ALL`
- `--security-opt no-new-privileges`
- `--pids-limit 128` (or similar)
- `--memory 512m` and `--cpus 0.5` (or similar)
- `--user 1000:1000`
- tmpfs mounts for `/tmp` and home
- mount session output dir to a known path (e.g., `/data/session`)

**Deliverables**
- `apps/terminal/src/sandboxRunner.ts` (or similar) encapsulating container spawn logic
- terminal server uses sandboxRunner exclusively

**Acceptance criteria**
- Grep check: no `node-pty` spawn of `bash` anywhere
- Grep check: no `exec("bash -c")` / `spawn("bash")`
- Unit test or small integration test that a session starts and returns output

---

### 4B) Add abuse controls: token gating + rate limits
**Agent actions**
1) Add `POST /session` endpoint:
- returns a short-lived token (JWT or random nonce stored in memory/redis)
- TTL 60s for WS establishment
- binds token to IP (optional) and user-agent (optional)
- does not require secrets in the client (server-only signing secret)

2) WebSocket handshake requires token:
- `wss://quarry.../ws?token=...`
- reject if missing/expired/invalid

3) Rate limit:
- per-IP concurrent session cap (e.g., 1–2)
- per-IP connection attempts per minute
- WS message rate limit (drop/close on abuse)

**Deliverables**
- Session token issuance + validation
- Rate limiter module

**Acceptance criteria**
- WS refused without token
- Multiple sessions from same IP blocked as configured

**MANUAL (YOU)**
- Provide signing secret / token secret for terminal service (store in droplet env, not git).

---

### 4C) Remove wildcard DNS assumptions (in code/config)
**Agent actions**
- Ensure host validation in terminal service + nginx config only accepts `quarry.russellbomer.com`.
- Do not assume wildcard routing.

**Deliverables**
- Nginx server_name restricted to quarry host
- App checks Host header if applicable

**Acceptance criteria**
- Requests with wrong Host are rejected (444/403)

---

## Stage 5 — Deployment artifacts for terminal droplet (compose + systemd + nginx)
Goal: reproducible deployment, minimal privileges.

**Agent actions**
1) Create `apps/terminal/deploy/docker-compose.yml` for:
- `terminal-server` (Node WS server) bound to `127.0.0.1:4001`
- `nginx` reverse proxy bound to `0.0.0.0:443` (and 80 for ACME redirect if needed)

2) Ensure terminal-server can run docker:
- Preferred: run a separate “sandbox runner” service that has Docker access and is minimal.
- If simplest: terminal-server needs access to docker socket.
  - If you do this, you must treat it as high-risk and lock it down:
    - only local socket
    - terminal-server runs as non-root user
    - droplet firewall limits inbound
    - consider using rootless docker if feasible
(Agent should implement the minimal viable approach but clearly document the docker.sock risk.)

3) Add `apps/terminal/deploy/systemd/terminal.service` that runs `docker compose up` or starts node + nginx.
4) Add nginx config with:
- WS upgrade headers
- `/ws` proxied to `127.0.0.1:4001`
- `/files` proxied to terminal-server file endpoints
- strict limits:
  - `limit_conn`, `limit_req` for `/ws` and `/session`
  - timeouts
  - body size limits

**Deliverables**
- Compose file
- systemd unit file
- nginx site config

**Acceptance criteria**
- `docker compose up` works locally (where possible)
- configs lint: `nginx -t` passes in container or host

---

## Stage 6 — Vercel configuration (portfolio deployment)
**MANUAL (YOU)**
- Create Vercel project via GitHub integration.
- Set **Root Directory** to `apps/portfolio`.
- Configure environment variables (only public ones if needed).

**Agent actions**
1) Add `.vercelignore` at repo root to exclude:
- `apps/terminal/**`
- any large test assets not needed for portfolio

2) Add `vercel.json` only if needed; keep default if possible.

**Deliverables**
- `.vercelignore`
- optional `vercel.json` (only if necessary)

**Acceptance criteria**
- Vercel build only touches `apps/portfolio`
- No terminal code deployed to Vercel

---

## Stage 7 — DigitalOcean droplet rebuild for terminal demo
This is all infra control-plane work.

**MANUAL (YOU)**
1) Create a new droplet (Ubuntu 22.04).
2) Attach DO Cloud Firewall:
- inbound 80/443 from world
- inbound 22 only from your IP
3) Decide outbound policy:
- If terminal session containers use `--network none`, outbound restrictions are optional but still useful.
- If you want droplet egress controls, implement host firewall rules (more work; do after the demo works).
4) Set up DNS:
- `quarry.russellbomer.com` A record → new droplet IP
- Portfolio apex/www → Vercel

**Agent actions (prepare runbook)**
- Create `apps/terminal/deploy/RUNBOOK.md` with:
  - server bootstrap commands (create non-root user, disable root SSH, unattended upgrades, fail2ban)
  - how to install docker + compose
  - how to deploy via git pull + docker compose
  - how to provision TLS (or use Cloudflare proxy)  
  - how to rotate deploy key

**Acceptance criteria**
- Runbook is complete and copy/paste-ready.

---

## Stage 8 — Decommission old droplet
**MANUAL (YOU)**
- Destroy compromised droplet.
- Remove old deploy keys from GitHub.
- Revoke/rotate any DO tokens, GitHub tokens that may have lived on the old droplet.
- Verify no unexpected inbound/outbound traffic on new droplet via DO graphs.

---

# Final verification checklist (end-to-end)
**Portfolio (Vercel)**
- `https://russellbomer.com` loads from Vercel
- No SSH/VPS for main site
- Terminal component connects to WS URL only

**Terminal (DO droplet)**
- `wss://quarry.russellbomer.com/ws` requires short-lived token
- Each session starts a container with `--network none`
- No `bash` spawned anywhere
- Session TTL enforced, rate limits enforced
- Nginx host restricted to `quarry.russellbomer.com`
- DO firewall restricts SSH to your IP

---

# What I need from you (so the agent can execute precisely)
Provide Claude Code with:
1) Your current repo tree (top-level directories) after you pull latest.  
2) The current contents of:
   - `deploy/docker/docker-compose.yml`
   - `deploy/nginx/sites-available/portfolio.conf`
   - the code that spawns `node-pty` / processes WS input (the relevant portion only)

If you paste those into the agent prompt, it can implement Stages 2–5 with minimal guesswork.
