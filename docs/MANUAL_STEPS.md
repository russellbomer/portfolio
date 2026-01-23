# MANUAL_STEPS.md

This file lists the tasks that must be performed by the human (YOU), not by an agent.  
These are the “hard stops” from the plan and guardrails. :contentReference[oaicite:5]{index=5}

## A) Credential rotation / secret hygiene (MANUAL)

### 1) Rotate leaked/embedded credentials
- [ ] Identify where the leaked DB password is used (DB/service/etc.) and rotate it.
- [ ] Replace the secret in working files (do not commit real values).
- [ ] Confirm no other credentials exist in repo docs/notes.

### 2) Decide on git history purge (recommended if public)
Plan describes purging `.agent/handoff.md` from history and force-pushing. :contentReference[oaicite:6]{index=6}
- [ ] Decide: purge history? (Yes/No)
- [ ] If Yes:
  - [ ] Install `git-filter-repo`
  - [ ] Run the prepared script (`scripts/purge-secret.sh`)
  - [ ] Force-push branches and tags
  - [ ] Notify any other clones/forks to re-clone or fix history

### 3) Rotate any tokens that ever lived on the compromised droplet
- [ ] DigitalOcean API tokens
- [ ] GitHub PATs (classic/fine-grained)
- [ ] Any service API keys (analytics, email, DB, etc.)
- [ ] Any SSH private keys that were present on the droplet

---

## B) GitHub / deploy keys (MANUAL)

Terminal droplet will need a deploy key for pulling code (read-only).
- [ ] Create a new GitHub deploy key (read-only) for the repo (or terminal repo if you split).
- [ ] Add the public key in GitHub repo settings.
- [ ] Install the private key on the new terminal droplet under a non-root user.
- [ ] Remove old deploy keys used by the compromised droplet.

---

## C) Vercel project setup (MANUAL)
Plan: create Vercel project and set root directory to `apps/portfolio`. :contentReference[oaicite:7]{index=7}
- [ ] Create Vercel project via GitHub integration:
  1. Go to https://vercel.com/new
  2. Import the `portfolio` repository from GitHub
  3. **CRITICAL:** Before clicking "Deploy", expand "Root Directory" under "Configure Project"
  4. Click "Edit" next to Root Directory
  5. Enter: `apps/portfolio`
  6. Vercel will auto-detect Next.js framework
- [ ] Configure environment variables (if needed):
  - `NEXT_PUBLIC_TERMINAL_WS_URL` = `wss://quarry.russellbomer.com/ws`
  - `NEXT_PUBLIC_FEATURE_TERMINAL` = `true`
  - Any other public config from `.env.production.example`
- [ ] Click "Deploy" and confirm the build succeeds.
- [ ] Verify the deployed site works at the Vercel preview URL.

**Note:** The repo includes a `.vercelignore` file that excludes `apps/terminal/**` and other non-portfolio paths from the build context.

---

## D) DNS changes (MANUAL)
- [ ] Point apex + www to Vercel per Vercel instructions.
- [ ] Point `quarry.russellbomer.com` A record to the new terminal droplet IP.
- [ ] Remove/cleanup any old records pointing to compromised infrastructure.
- [ ] Confirm TLS and routing after cutover.

---

## E) DigitalOcean rebuild (MANUAL)
Plan: new droplet (Ubuntu 22.04) + Cloud Firewall restricting inbound. :contentReference[oaicite:8]{index=8}
- [ ] Create new droplet from official Ubuntu 22.04 image.
- [ ] Attach DO Cloud Firewall:
  - [ ] inbound 80/443 from world
  - [ ] inbound 22 only from your IP
- [ ] Decide egress strategy:
  - [ ] If session containers use `--network none`, host egress controls are optional (still consider monitoring).
  - [ ] If implementing host egress firewall rules, do it after basic functionality is stable.
- [ ] Destroy compromised droplet after data recovery (if any) and after cutover.

---

## F) Server bootstrap + SSH hardening (MANUAL)
Do this on the new terminal droplet before deploying app:
- [ ] Create a non-root user with sudo.
- [ ] Disable root SSH login.
- [ ] Enforce key-only SSH auth.
- [ ] Set up unattended upgrades.
- [ ] Install fail2ban (or equivalent).
- [ ] Confirm only required ports are exposed.

---

## G) TLS provisioning for quarry subdomain (MANUAL)
- [ ] Choose TLS approach:
  - [ ] certbot on droplet (with nginx)
  - [ ] or DNS-01 workflow if needed
  - [ ] or a proxy/CDN approach you trust
- [ ] Issue certs for `quarry.russellbomer.com`.
- [ ] Confirm WS works over TLS (`wss://...`).

---

## H) Decommission old infra (MANUAL)
Plan: destroy old droplet, remove old deploy keys, rotate tokens. :contentReference[oaicite:9]{index=9}
- [ ] Destroy compromised droplet.
- [ ] Remove old GitHub deploy keys.
- [ ] Revoke old DO tokens / GitHub tokens.
- [ ] Verify no unexpected traffic on new droplet (DO graphs).

---

## I) Final validation (MANUAL)
- [ ] `https://russellbomer.com` served from Vercel.
- [ ] Terminal demo reachable at `quarry.russellbomer.com`.
- [ ] WS requires short-lived token and sessions run in `--network none` containers.
- [ ] Confirm abuse controls (rate limits, TTLs) are in effect.
