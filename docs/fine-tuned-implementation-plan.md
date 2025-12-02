# Fine-Tuned Implementation Plan

**Status:** Ready for execution
**Created:** December 2, 2025
**Branch:** `feature/landing-page-v2`

---

## 1. Context and Objectives

### Project Overview

A craftsman-themed personal portfolio platform built with Next.js 15, featuring scroll-driven animations, interactive terminal demos on subdomains, and a curated project showcase. The site positions Russell Bomer as a full-stack developer available for freelance and consulting work.

### Key Preferences and Constraints

- **Tech Stack**: Next.js 15, React 19, Framer Motion, Tailwind CSS, shadcn/ui, Drizzle ORM, PostgreSQL
- **Package Manager**: npm
- **Hosting**: DigitalOcean VPS with Nginx reverse proxy, wildcard SSL (portable to Hetzner)
- **Design System**: 6-color craftsman palette (Linen, Thorn, Fern, Rust, Eucalyptus, Creamsicle)
- **Performance KPIs**: LCP < 1500ms, demo error rate < 1%, uptime ≥ 99.9%
- **Personas**: Freelance clients, technical managers, fellow developers

### Source Documents

- `docs/phase-1-initiation-&-planning/1.1.txt` — Vision & personas
- `docs/phase-1-initiation-&-planning/1.2.txt` — Scope & constraints
- `docs/phase-1-initiation-&-planning/1.3.txt` — Organization & collaboration
- `docs/phase-1-initiation-&-planning/1.4.txt` — Schedule & milestones
- `docs/implementation-plan.md` — Visual overhaul phases (Phases 1-4 complete)
- `docs/codebase-review-2024-12-02.md` — Current state assessment
- `ai/anchors.json` — Structured decision anchors

---

## 2. High-Level Phases

- **Phase A:** Terminal Demo Verification & Live Deployment Testing
- **Phase B:** Content & Feature Completion
- **Phase C:** Legacy Code Cleanup
- **Phase D:** Documentation Updates
- **Phase E:** Launch Preparation
- **Phase F:** Post-Launch Polish & CI Setup

---

## 3. Detailed Plan

### Phase A — Terminal Demo Verification & Live Deployment Testing

**Goal:** Confirm the Quarry terminal demo is fully functional in production environment on subdomain.

**Scope:**

- Run full QA checklist from `interactive-demo-qa.md`
- Deploy current build to DigitalOcean VPS
- Verify subdomain routing and WebSocket connections
- Confirm error boundaries and fallback modes

**Excluded:** New feature development until demo verified

**Recovery Completed (2025-12-02):**

- ✅ Recovered `server/terminal/server.ts` and `README.md` from `origin/feature/phase2-refactor`
- ✅ Recovered `components/demo/*` (4 files) from remote
- ✅ Recovered `app/demos/terminal/page.tsx` from remote
- ✅ Kept newer styled `app/demos/page.tsx` (local)
- ✅ Updated terminal demo status to "live" in demos page
- ✅ Added `dev:terminal` npm script to package.json
- ⚠️ `node-pty` fails to compile on Windows (native module issue) — Live PTY requires Linux/VPS

**Deployment Decisions (2025-12-02):**

| Setting              | Decision                                      |
| -------------------- | --------------------------------------------- |
| Terminal server port | 4001                                          |
| WebSocket URL        | `wss://quarry.russellbomer.com/ws`            |
| Security model       | Docker container (quarry-sandbox)             |
| Process management   | systemd                                       |
| node-pty             | optionalDependencies (skip Windows)           |
| Container network    | Outbound HTTP allowed (for web scraping)      |
| Container storage    | Temp volume per session, downloadable outputs |

**Tasks:**

1. **A.1 — Start dev server and verify local demo page renders**

   - Run `npm run dev`
   - Visit `http://localhost:3000/demos`
   - Confirm: Page loads without console errors or hydration warnings
   - Dependencies: None
   - Status: [x] ✅ Completed 2025-12-02

2. **A.1a — Recover terminal demo infrastructure** _(Added during execution)_

   - Recover missing files from `origin/feature/phase2-refactor`
   - Install missing dependencies (xterm, ws)
   - Add `dev:terminal` npm script
   - Dependencies: A.1
   - Status: [x] ✅ Completed 2025-12-02

3. **A.1b — Style terminal demo page to match visual overhaul** _(Added during execution)_

   - Update `app/demos/terminal/page.tsx` with craftsman theme styling
   - Match layout and typography to rest of site
   - Ensure consistent spacing, colors, and responsive behavior
   - Dependencies: A.1a
   - Status: [x] ✅ Completed 2025-12-02

4. **A.2 — Test Scripted Demo fallback locally**

   - Refresh `/demos/terminal` (no terminal server running)
   - Confirm: UI shows "Mode: Demo (fallback)", scripted walkthrough runs
   - Test commands: `help`, `clear`, `replay`
   - Dependencies: A.1b
   - Status: [x] ✅ Completed 2025-12-02

5. **A.3 — Add node-pty as optional dependency**

   - Add `"node-pty": "^1.0.0"` to `optionalDependencies` in `package.json`
   - Update `server/terminal/README.md` to document Windows limitation
   - Dependencies: None
   - Status: [x] ✅ Completed 2025-12-02

6. **A.4 — Prepare VPS infrastructure**

   - SSH to VPS
   - Verify Docker installed: `docker --version`
   - Verify Node.js 20+ installed: `node --version`
   - Verify Nginx installed and running: `nginx -v`
   - Create project directory if needed
   - Dependencies: None
   - Status: [ ]

7. **A.5 — Create Docker container for Quarry sandbox**

   - Create `deploy/docker/Dockerfile`:
     - Base: Node.js 20 Alpine
     - Install quarry CLI globally
     - Minimal shell (sh), no extra tools
   - Create `deploy/docker/docker-compose.yml`:
     - Container name: `quarry-sandbox`
     - Network: allow outbound HTTP (for web scraping)
     - Volume: temp directory for session outputs
   - Build on VPS: `docker build -t quarry-sandbox .`
   - Start container: `docker-compose up -d`
   - Dependencies: A.4
   - Status: [x] ✅ Files created 2025-12-02 (build/start on VPS pending)

8. **A.6 — Modify terminal server for Docker exec**

   - Update `server/terminal/server.ts`:
     - Spawn `docker exec -it quarry-sandbox sh` instead of direct PTY
     - Map session temp directory for downloadable outputs
   - Add download endpoint or mechanism for generated files
   - Test locally if Docker available, otherwise test on VPS
   - Dependencies: A.5
   - Status: [ ]

9. **A.7 — Update Nginx configuration**

   - Edit `deploy/nginx/sites-available/portfolio.conf`
   - Add location block for `quarry.russellbomer.com`:
     ```nginx
     location /ws {
         proxy_pass http://127.0.0.1:4001;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
         proxy_set_header Host $host;
         proxy_read_timeout 86400;
     }
     ```
   - Symlink to `/etc/nginx/sites-enabled/`
   - Test: `nginx -t`
   - Reload: `systemctl reload nginx`
   - Dependencies: A.4
   - Status: [x] ✅ Config updated 2025-12-02 (deploy to VPS pending)

10. **A.8 — Configure environment variables**

    - Update `.env.example` with terminal variables (documented):
      ```bash
      NEXT_PUBLIC_FEATURE_TERMINAL=false
      NEXT_PUBLIC_TERMINAL_WS_URL=ws://localhost:4001/ws
      TERMINAL_PORT=4001
      TERMINAL_HOST=127.0.0.1
      ```
    - Create `.env.local` for Windows dev (feature disabled)
    - Configure VPS `.env` with production values:
      ```bash
      NEXT_PUBLIC_FEATURE_TERMINAL=true
      NEXT_PUBLIC_TERMINAL_WS_URL=wss://quarry.russellbomer.com/ws
      TERMINAL_PORT=4001
      ```
    - Dependencies: None
    - Status: [x] ✅ .env.example updated 2025-12-02 (VPS .env pending)

11. **A.9 — Create systemd service for terminal server**

    - Create `deploy/terminal.service`:

      ```ini
      [Unit]
      Description=Portfolio Terminal WebSocket Server
      After=network.target docker.service

      [Service]
      Type=simple
      User=www-data
      WorkingDirectory=/var/www/portfolio
      Environment=TERMINAL_PORT=4001
      Environment=TERMINAL_HOST=127.0.0.1
      ExecStart=/usr/bin/node server/terminal/server.ts
      Restart=always
      RestartSec=5

      [Install]
      WantedBy=multi-user.target
      ```

    - Install on VPS: copy to `/etc/systemd/system/terminal.service`
    - Enable and start: `systemctl enable --now terminal`
    - Dependencies: A.6
    - Status: [x] ✅ Service file created 2025-12-02 (install on VPS pending)

12. **A.10 — Create deployment branch and push**

    - Create branch: `git checkout -b deploy/terminal-live`
    - Commit all deployment configs
    - Push to GitHub: `git push -u origin deploy/terminal-live`
    - Dependencies: A.3, A.5, A.6, A.7, A.8, A.9
    - Status: [x] ✅ Completed 2025-12-02

13. **A.11 — Deploy and test Live PTY on VPS**

    - SSH to VPS
    - Pull branch: `git fetch && git checkout deploy/terminal-live`
    - Install dependencies: `npm install` (node-pty compiles on Linux)
    - Build Next.js: `npm run build`
    - Start Docker container: `docker-compose -f deploy/docker/docker-compose.yml up -d`
    - Start terminal service: `systemctl start terminal`
    - Start Next.js app (PM2 or systemd)
    - Test WebSocket: open `https://quarry.russellbomer.com/demos/terminal`
    - Confirm: "Mode: Live" appears, terminal connects
    - Dependencies: A.10
    - Status: [ ]

14. **A.12 — Test quarry commands in production**

    - Run `quarry foreman` (guided tutorial) — verify prompts work
    - Run `quarry scout <url>` — verify network access works
    - Run full workflow, generate output file
    - Test download of generated file
    - Verify 2-minute inactivity timeout resets session
    - Dependencies: A.11
    - Status: [ ]

15. **A.13 — Test Scripted Fallback in production**

    - Stop terminal service: `systemctl stop terminal`
    - Refresh browser — verify fallback mode activates
    - Restart: `systemctl start terminal`
    - Confirm live mode resumes
    - Dependencies: A.11
    - Status: [ ]

16. **A.14 — Validate performance metrics**

    - Measure LCP on demo page (target < 1500ms)
    - Measure cold start to usable terminal (target < 800ms)
    - Document findings in `docs/interactive-demo-qa.md`
    - Dependencies: A.12
    - Status: [ ]

**Notes and Constraints:**

- If any A.x task fails, fix before proceeding
- Terminal must be production-ready for public use at launch
- Docker container provides security isolation for public terminal access
- Users can run quarry commands including web scraping and download outputs

---

### Phase B — Content & Feature Completion

**Goal:** Complete all content, add new project cards, implement resume download, and update footer.

**Scope:**

- Remove placeholder content
- Add real project cards
- New features: resume download, social links
- Copy refinement across all pages

**Tasks:**

1. **B.1 — Remove CLI Notes placeholder**

   - Delete `content/projects/cli-notes.json` (if exists)
   - Remove any references in components or pages
   - Dependencies: None
   - Status: [ ]

2. **B.2 — Create NFL Analytics Dashboard project card**

   - Create `content/projects/nfl-analytics.json`
   - Fields: title, slug, brief description, "Coming Soon" status
   - Style: Simple card with "Coming Soon" badge (no full details)
   - Dependencies: B.1
   - Status: [ ]

3. **B.3 — Create Simplytics API project card**

   - Create `content/projects/simplytics-api.json`
   - Fields: title, slug, brief description, "Coming Soon" status
   - Style: Simple card with "Coming Soon" badge
   - Dependencies: B.1
   - Status: [ ]

4. **B.4 — Add X (Twitter) social link to footer**

   - Update `components/layout/Footer.tsx`
   - Add X icon and link
   - Dependencies: None
   - Status: [ ]

5. **B.5 — Add Instagram social link to footer**

   - Update `components/layout/Footer.tsx`
   - Add Instagram icon and link
   - Dependencies: None
   - Status: [ ]

6. **B.6 — Add resume download link to footer**

   - Add PDF to `public/` directory (user provides file)
   - Add download link/button in footer alongside social links
   - Dependencies: User provides resume PDF
   - Status: [ ]

7. **B.7 — Add resume download to Connect page**

   - Add download link/button to `app/connect/page.tsx`
   - Dependencies: B.6
   - Status: [ ]

8. **B.8 — Add resume download to TMI/About page**

   - Add download link/button to `app/tmi/page.tsx`
   - Dependencies: B.6
   - Status: [ ]

9. **B.9 — Complete/refine copy across all pages**
   - Review and finalize: Hero, About, Practice, Work, Connect sections
   - Refine `/writing` "Coming soon" copy
   - Ensure craftsman tone: thoughtful, dry wit, substantive
   - Dependencies: None
   - Status: [ ]

**Notes and Constraints:**

- Resume PDF to be designed independently by user
- Coming Soon cards should be visually distinct but not obtrusive

---

### Phase C — Legacy Code Cleanup

**Goal:** Remove all unused authentication and payment code from the SaaS template.

**Scope:**

- Delete auth-related files and directories
- Delete Stripe/payment-related files
- Remove unused environment variable references
- Clean up any orphaned imports

**Tasks:**

1. **C.1 — Delete `lib/auth/` directory**

   - Remove `lib/auth/middleware.ts`, `lib/auth/session.ts`, and any other files
   - Dependencies: None
   - Status: [ ]

2. **C.2 — Delete `lib/payments/` directory**

   - Remove all Stripe integration code
   - Dependencies: None
   - Status: [ ]

3. **C.3 — Remove auth-related database schema**

   - Audit `lib/db/schema.ts` for auth tables (users, sessions, etc.)
   - Remove if not needed for contact form or other features
   - Dependencies: C.1
   - Status: [ ]

4. **C.4 — Clean up environment variables**

   - Remove Stripe keys from `.env.example`
   - Remove auth-related secrets if unused
   - Dependencies: C.1, C.2
   - Status: [ ]

5. **C.5 — Remove orphaned imports and dead code**
   - Search codebase for imports from deleted directories
   - Remove unused components in `app/(login)/` if present
   - Dependencies: C.1, C.2, C.3, C.4
   - Status: [ ]

**Notes and Constraints:**

- Verify build succeeds after each deletion
- Keep database schema elements needed for contact form or activity logging

---

### Phase D — Documentation Updates

**Goal:** Ensure all documentation accurately reflects current project state.

**Tasks:**

1. **D.1 — Fix README.md route reference**

   - **Current (incorrect):** `Projects Showcase (/projects) — Filterable gallery of work...`
   - **Correct:** `Projects Showcase (/work) — Filterable gallery of work...`
   - File: `README.md`
   - Dependencies: None
   - Status: [ ]

2. **D.2 — Fix codebase-review date typo**

   - **Current (incorrect):** `**Date**: December 2, 2024`
   - **Correct:** `**Date**: December 2, 2025`
   - File: `docs/codebase-review-2024-12-02.md`
   - Note: Also consider renaming file to `codebase-review-2025-12-02.md`
   - Dependencies: None
   - Status: [ ]

3. **D.3 — Update implementation-plan.md with completion status**

   - Mark Phases 1-4 as ✅ Complete
   - Mark Phase 5 as ✅ Complete (with note about route rename done)
   - Update Phase 6 status
   - Add note that dark mode refinement was completed during visual overhaul
   - Remove SVG signature from deferred items (scrapped)
   - Dependencies: None
   - Status: [ ]

4. **D.4 — Update anchors.json scope if needed**

   - Remove CLI Notes from any references
   - Add NFL Analytics and Simplytics API if tracking in-progress projects
   - Verify milestones reflect current state
   - Dependencies: B.1, B.2, B.3
   - Status: [ ]

5. **D.5 — Update interactive-demo-qa.md verification log**
   - Add new verification entry after Phase A completion
   - Document environment, tester, and findings
   - Dependencies: Phase A complete
   - Status: [ ]

**Notes and Constraints:**

- Documentation should be updated as tasks complete, not batched at end

---

### Phase E — Launch Preparation

**Goal:** Final verification and production deployment.

**Scope:**

- SEO metadata verification
- Final build and deploy
- Smoke testing all routes

**Tasks:**

1. **E.1 — Verify SEO metadata on all pages**

   - Check meta titles, descriptions, OG tags
   - Verify social sharing previews
   - Dependencies: Phase B complete
   - Status: [ ]

2. **E.2 — Final production build**

   - Run `npm run build` and verify no errors
   - Check for TypeScript errors (including ScrollSection barrel export)
   - Dependencies: Phases B, C, D complete
   - Status: [ ]

3. **E.3 — Deploy final build to VPS**

   - Push to main branch (or merge feature branch)
   - Deploy to production
   - Dependencies: E.2
   - Status: [ ]

4. **E.4 — Smoke test all routes in production**

   - `/` — Landing page with all sections
   - `/work` — Project cards display correctly
   - `/demos` — Terminal demo functional on subdomain
   - `/connect` — Contact form submits
   - `/tmi` — Extended bio loads
   - `/writing` — Coming soon message
   - 404 page — "Lost?" messaging
   - Dependencies: E.3
   - Status: [ ]

5. **E.5 — Verify resume downloads work**
   - Test download links in footer, Connect, TMI
   - Dependencies: E.3, B.6-B.8
   - Status: [ ]

**Notes and Constraints:**

- Have rollback plan ready (previous git commit)

---

### Phase F — Post-Launch Polish & CI Setup

**Goal:** Address audits, set up CI pipeline, and improvements after successful launch.

**Scope:**

- Performance and accessibility audits
- CI/CD workflow configuration
- Visual regression test setup
- Future enhancements

**Tasks:**

1. **F.1 — Performance audit**

   - Run Lighthouse on key pages
   - Test on throttled connection
   - Verify font loading (no layout shift)
   - Document and address findings
   - Dependencies: Launch complete
   - Status: [ ]

2. **F.2 — Accessibility audit**

   - Verify `prefers-reduced-motion` disables animations
   - Test keyboard navigation
   - Check color contrast ratios
   - Fix any issues found
   - Dependencies: Launch complete
   - Status: [ ]

3. **F.3 — Set up CI workflow**

   - Create `.github/workflows/ci.yml`
   - Configure: lint, type-check, build on PR
   - Consider: automated deploy on merge to main
   - Add status badges to README
   - Dependencies: Launch complete
   - Status: [ ]

4. **F.4 — Set up visual regression tests**

   - Configure Playwright for screenshot comparison
   - Cover key pages and states
   - Integrate with CI workflow
   - Dependencies: F.1, F.2, F.3 complete
   - Status: [ ]

5. **F.5 — Refine `/writing` copy**
   - Polish "Coming soon" messaging
   - Consider adding newsletter signup teaser
   - Dependencies: Launch complete
   - Status: [ ]

**Notes and Constraints:**

- These are non-blocking; site can be live while addressing
- Custom illustrations remain deferred indefinitely
- Loading skeletons remain deferred

---

## 4. Priorities and Trade-offs

### Must-Have (Launch Blockers)

- Terminal demo fully functional on subdomain
- All pages render without errors
- Content complete (no Lorem ipsum or broken placeholders)
- Resume download working
- Social links in footer

### Nice-to-Have (Can ship without)

- Perfect Lighthouse scores
- CI workflow
- Visual regression tests
- Loading skeletons

### Explicitly Deferred

- Search/filter for projects (only 3 cards, not needed)
- Custom illustrations
- Loading skeleton animations
- Writing/blog content (beyond "Coming soon")
- Backend analytics

### Permanently Removed

- Animated SVG signature
- Metrics/counter section
- Authentication system
- Stripe/payment integration

---

## 5. Handoff Notes for Downstream Agents

### How to Use This Plan

1. Execute phases sequentially (A → B → C → D → E)
2. Phase F can run in parallel after launch
3. Each task includes dependencies — do not skip ahead
4. Mark tasks complete in this document as you go (change `[ ]` to `[x]`)

### Human Review Recommended

- **B.9 (Copy refinement)** — Tone and voice are subjective
- **C.3 (Database schema)** — Verify no data loss implications
- **Resume PDF** — User provides independently

### Key File Locations

- Project content: `content/projects/*.json`
- Footer component: `components/layout/Footer.tsx`
- Terminal demo: `app/demos/`, `server/terminal/`
- Legacy code to delete: `lib/auth/`, `lib/payments/`
- CI workflow: `.github/workflows/ci.yml` (to be created)

### Performance Budgets

- LCP: < 1500ms
- Demo cold start: < 800ms
- Demo error rate: < 1%

### References

- QA Checklist: `docs/interactive-demo-qa.md`
- ADR for subdomain routing: `docs/architecture/ADR-0001-subdomain-routing.md`
- AI guidelines: `docs/ai-guidelines.md`
- Anchors: `ai/anchors.json`

---

## Revision Log

| Date       | Change                                 | Rationale                                                                 |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------- |
| 2025-12-02 | Initial plan created                   | Consolidated from codebase review, implementation plan, and user feedback |
| 2025-12-02 | Phase A expanded with deployment tasks | Added Docker container setup, systemd, Nginx WebSocket config, env vars   |

---

**First Action:** Phase A.2 — Test Scripted Demo fallback locally
