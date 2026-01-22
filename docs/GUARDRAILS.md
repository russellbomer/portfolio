# GUARDRAILS.md

This repo is being refactored and redeployed according to `docs/IMPLEMENTATION_PLAN.md`. :contentReference[oaicite:1]{index=1}  
These guardrails are **binding** for any CLI coding agent (Claude Code) working on this repo.

## 0) Non-negotiables

### Security invariants (terminal demo)
These must remain true throughout all stages (especially Stages 4–5). :contentReference[oaicite:2]{index=2}

1) **NO HOST SHELL**
- Do not spawn `bash` (or any shell) for interactive sessions.
- Do not use `bash -c`, `exec("...")`, `execSync("...")`, or any shell interpolation of user-provided input.
- Interactive UX must not rely on arbitrary shell parsing.

2) **MANDATORY PER-SESSION SANDBOX**
- Each terminal session must run inside a sandbox container (per-session container) and must not execute on the host.
- Container must be launched with hard constraints:
  - `--network none` (or equivalent)
  - `--read-only`
  - `--cap-drop ALL`
  - `--security-opt no-new-privileges`
  - `--pids-limit` (e.g., 128)
  - `--memory` and `--cpus` limits
  - `--user` non-root
  - tmpfs mounts for writable paths

3) **NO DOCKER PRIVILEGE ESCALATION**
- Do not add `privileged: true`.
- Do not add `network_mode: host`.
- Do not mount `/var/run/docker.sock` unless explicitly approved by the human (high risk). If it’s required for MVP, the agent must STOP and request approval and document the risk.

4) **HOST/ROUTING STRICTNESS**
- Terminal service + nginx must only accept `Host: quarry.russellbomer.com` and reject other hosts (444/403).
- Do not rely on wildcard routing assumptions.

### Repo hygiene invariants
- Do not commit secrets or real credentials.
- Do not commit `.env*` files (only `.env*.example`).
- Do not add new production dependencies without clear justification.

---

## 1) Hard stops (agent must STOP and hand off)

If any item below is encountered or required, the agent must STOP and request the human to do it:

### Credentials / secrets / identity (MANUAL)
- rotating any password, token, API key, OAuth secret, deploy key, SSH key, TLS key
- touching secret files: `.env`, `.env.production`, `*.pem`, `id_rsa`, `id_ed25519`, `known_hosts`
- printing env values or secrets to output/logs

### Remote/account changes (MANUAL)
- DigitalOcean / Vercel / Hostinger actions (creating/destroying droplets, firewall changes, DNS, Vercel project settings)
- GitHub settings changes (deploy keys, repo secrets, Actions config)
- TLS issuance/renewal (certbot, DNS-01, ACME)

### Destructive git actions (MANUAL)
- history rewrites (`git filter-repo`, `git filter-branch`, BFG)
- force pushes (`git push --force --all`, `git push --force --tags`) :contentReference[oaicite:3]{index=3}

---

## 2) Command execution policy (must follow)
- The agent may propose commands but must request approval before running them.
- Each request must include:
  - exact command(s)
  - why it’s needed
  - expected outcome
- No “bundled” commands that hide intent (avoid `curl | bash`, large one-liners, or pipes that obscure behavior).
- Never use commands that exfiltrate data (e.g., posting files to the internet).

---

## 3) Working style requirements (stage-gated)
The agent must execute **exactly one stage per run**.

For each stage:
1) Read:
   - `docs/IMPLEMENTATION_PLAN.md`
   - `docs/GUARDRAILS.md`
   - `docs/STATUS.md`
2) Restate:
   - current stage
   - files it expects to change
   - acceptance checks it will run
3) Implement changes.
4) Run acceptance checks (per stage).
5) Show:
   - `git diff --stat`
   - key diffs
   - acceptance command output
6) Commit with a stage-scoped message.
7) Update `docs/STATUS.md`.
8) STOP.

---

## 4) Minimum acceptance checks (do not skip)

### Universal (every stage)
- `git status` is clean (except intended changes)
- `git diff --stat` reviewed

### Stage 2 (monorepo move) checks
- `cd apps/portfolio && npm ci && npm run build` :contentReference[oaicite:4]{index=4}
- `cd apps/terminal && npm ci && npm run lint` (or build)

### Stage 3 (portfolio hardening) checks
- confirm no Next canary versions
- `npm audit` output reviewed

### Stage 4 (terminal hardening) “prove it” checks
The agent must run and paste outputs of:
- `rg -n "spawn\\(\\s*['\\\"]bash['\\\"]|bash -c|exec\\(|execSync\\(" apps/terminal`
- `rg -n "--network\\s+none|network:\\s*none" apps/terminal`
- `rg -n "privileged:\\s*true|network_mode:\\s*host|/var/run/docker\\.sock" apps/terminal`

If these checks fail, the agent must fix before proceeding.

---

## 5) Scope control
- Do not introduce new architecture patterns not required by the plan.
- Prefer mechanical moves (`git mv`) and minimal refactors.
- If a refactor becomes necessary, the agent must explain the dependency chain and keep the diff tight.

---

## 6) Logging policy
- Do not log request headers/cookies/tokens for the terminal demo.
- Do not log WS payloads by default.
- Debug logs must be gated by a debug flag and must redact sensitive values.
