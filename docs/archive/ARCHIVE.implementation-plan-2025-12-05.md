# Implementation Plan — December 5, 2025 Update

**Status:** In Progress
**Last Updated:** December 5, 2025
**Current Branch:** `deploy/terminal-live`
**Previous Document:** `docs/fine-tuned-implementation-plan.md`

---

## Executive Summary

This document consolidates the original fine-tuned implementation plan with findings from a comprehensive codebase review conducted on December 5, 2025. It provides an accurate status of all phases, identifies work that was marked complete but requires additional effort, and outlines remaining tasks to launch readiness.

### Overall Progress

| Phase | Name                                         | Status                   | Completion      |
| ----- | -------------------------------------------- | ------------------------ | --------------- |
| A     | Terminal Demo Verification & Live Deployment | ⚠️ **Ready to Complete** | ~92%            |
| B     | Content & Feature Completion                 | ⏸️ Blocked               | 67% (6/9 tasks) |
| C     | Legacy Code Cleanup                          | ✅ Complete              | 100%            |
| D     | Documentation Updates                        | ✅ Complete              | 100%            |
| E     | Launch Preparation                           | ⏳ Not Started           | 0%              |
| F     | Post-Launch Polish & CI Setup                | ⏳ Not Started           | 0%              |

### Critical Findings & Refinements from December 5 Review

1. **A.15 (Document Export)**: Infrastructure exists; refined plan focuses on:

   - Configuring Quarry to output to single session directory
   - Verifying Docker bind mount and file creation on host
   - End-to-end testing of download flow
   - **Status:** Ready for implementation

2. **A.16 (Security Audit)**: Filesystem guardrails needed; refined plan:

   - Command filtering at PTY input level (casual escape prevention)
   - Block cd commands targeting parent/root/absolute paths
   - Escalate to restricted shell (rbash) only if filtering gaps discovered
   - **Status:** Ready for implementation

3. **A.17 (Session Lifecycle)** _(NEW)_: Enhancement for demo UX:

   - Reset terminal on page load (clear buffer, rerun Quarry banner)
   - Session ID persists (files remain downloadable)
   - Adjust inactivity timeout (pending user preference)
   - **Status:** Ready for implementation

4. **B.6-B.8 (Resume)**: Blocked pending user-provided PDF
5. **B.9 (Copy)**: Needs human review to mark complete

---

## 1. Context and Objectives

### Project Overview

A craftsman-themed personal portfolio platform built with Next.js 15, featuring scroll-driven animations, interactive terminal demos on subdomains, and a curated project showcase. The site positions Russell Bomer as a full-stack developer available for freelance and consulting work.

### Key Preferences and Constraints

- **Tech Stack**: Next.js 15, React 19, Framer Motion, Tailwind CSS, shadcn/ui, Drizzle ORM, PostgreSQL
- **Package Manager**: npm (note: pnpm-lock.yaml also present)
- **Hosting**: DigitalOcean VPS with Nginx reverse proxy, wildcard SSL (portable to Hetzner)
- **Design System**: 6-color craftsman palette (Linen, Thorn, Fern, Rust, Eucalyptus, Creamsicle)
- **Performance KPIs**: LCP < 1500ms, demo error rate < 1%, uptime ≥ 99.9%
- **Personas**: Freelance clients, technical managers, fellow developers

### Source Documents

- `docs/phase-1-initiation-&-planning/1.1.txt` — Vision & personas
- `docs/phase-1-initiation-&-planning/1.2.txt` — Scope & constraints
- `docs/phase-1-initiation-&-planning/1.3.txt` — Organization & collaboration
- `docs/phase-1-initiation-&-planning/1.4.txt` — Schedule & milestones
- `docs/visual-overhaul-implementation-plan.md` — Visual overhaul phases (All complete)
- `docs/codebase-review-2025-12-02.md` — Previous state assessment
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

**Status:** ⚠️ **Partially Complete** — A.15 and A.16 require additional work

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
| Docker filesystem    | Full tmpfs for `/home/quarry` (256MB)         |
| File download        | HTTP endpoints `/files` on terminal server    |
| Session isolation    | Per-session directories with auto-cleanup     |
| Container restart    | Daily at 04:00 via systemd timer              |

**Tasks:**

1. **A.1 — Start dev server and verify local demo page renders**

   - Run `npm run dev`
   - Visit `http://localhost:3000/demos`
   - Confirm: Page loads without console errors or hydration warnings
   - Dependencies: None
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: `app/demos/page.tsx` exists with proper styling

2. **A.1a — Recover terminal demo infrastructure** _(Added during execution)_

   - Recover missing files from `origin/feature/phase2-refactor`
   - Install missing dependencies (xterm, ws)
   - Add `dev:terminal` npm script
   - Dependencies: A.1
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: `server/terminal/server.ts`, `components/demo/*` files exist

3. **A.1b — Style terminal demo page to match visual overhaul** _(Added during execution)_

   - Update `app/demos/terminal/page.tsx` with craftsman theme styling
   - Match layout and typography to rest of site
   - Ensure consistent spacing, colors, and responsive behavior
   - Dependencies: A.1a
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: Terminal page uses craftsman palette

4. **A.2 — Test Scripted Demo fallback locally**

   - Refresh `/demos/terminal` (no terminal server running)
   - Confirm: UI shows "Mode: Demo (fallback)", scripted walkthrough runs
   - Test commands: `help`, `clear`, `replay`
   - Dependencies: A.1b
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: `TerminalDemo.tsx` implements fallback mode

5. **A.3 — Add node-pty as optional dependency**

   - Add `"node-pty": "^1.0.0"` to `optionalDependencies` in `package.json`
   - Update `server/terminal/README.md` to document Windows limitation
   - Dependencies: None
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: Present in `package.json` optionalDependencies

6. **A.4 — Prepare VPS infrastructure**

   - SSH to VPS
   - Verify Docker installed: `docker --version`
   - Verify Node.js 20+ installed: `node --version`
   - Verify Nginx installed and running: `nginx -v`
   - Create project directory if needed
   - Dependencies: None
   - Status: [x] ✅ Completed 2025-12-02

7. **A.5 — Create Docker container for Quarry sandbox**

   - Create `deploy/docker/Dockerfile`
   - Create `deploy/docker/docker-compose.yml`
   - Build on VPS: `docker build -t quarry-sandbox .`
   - Start container: `docker-compose up -d`
   - Dependencies: A.4
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: Both files exist with proper configuration

8. **A.6 — Modify terminal server for Docker exec**

   - Update `server/terminal/server.ts`
   - Add download endpoint or mechanism for generated files
   - Dependencies: A.5
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: Server has session management, HTTP file endpoints

9. **A.7 — Update Nginx configuration**

   - Add location blocks for `/ws` and `/files`
   - Dependencies: A.4
   - Status: [x] ✅ Completed 2025-12-02
   - **Verified 2025-12-05**: `deploy/nginx/sites-available/portfolio.conf` has both locations

10. **A.8 — Configure environment variables**

    - Update `.env.example` with terminal variables
    - Dependencies: None
    - Status: [x] ✅ Completed 2025-12-02
    - **Verified 2025-12-05**: `.env.example` contains terminal configuration

11. **A.9 — Create systemd service for terminal server**

    - Create `deploy/terminal.service`
    - Dependencies: A.6
    - Status: [x] ✅ Completed 2025-12-02
    - **Verified 2025-12-05**: File exists with security hardening options

12. **A.10 — Create deployment branch and push**

    - Create branch: `git checkout -b deploy/terminal-live`
    - Dependencies: A.3, A.5, A.6, A.7, A.8, A.9
    - Status: [x] ✅ Completed 2025-12-02
    - **Verified 2025-12-05**: Currently on this branch

13. **A.11 — Deploy and test Live PTY on VPS**

    - Dependencies: A.10
    - Status: [x] ✅ Completed 2025-12-02

14. **A.12 — Test quarry commands in production**

    - Run `quarry foreman` (guided tutorial) — verify prompts work
    - Run `quarry scout <url>` — verify network access works
    - Run full workflow, generate output file
    - Test download of generated file
    - Verify 2-minute inactivity timeout resets session
    - Dependencies: A.11
    - Status: [x] ⚠️ Completed 2025-12-02, **download/export flow not fully functional**

15. **A.13 — Test Scripted Fallback in production**

    - Dependencies: A.11
    - Status: [x] ✅ Completed 2025-12-03

16. **A.14 — Validate performance metrics**

    - Dependencies: A.12
    - Status: [x] ✅ Completed 2025-12-03
    - **Results:** LCP: 720ms ✅ | Cold start: 167ms (no throttle), 533ms (4x CPU) ✅

17. **A.15 — Implement document export for Quarry demo** 🔄 READY FOR IMPLEMENTATION

    **Goal:** Enable users to download files generated during their Quarry terminal session.

    **Current State (Verified 2025-12-05):**

    - Infrastructure code exists (server endpoints, FileDownloader component)
    - End-to-end download flow NOT fully functional
    - Quarry output path configuration needs adjustment

    **Refined Approach (2025-12-05):**

    - Configure Quarry to output to single session directory: `/home/quarry/output/<session-id>/`
    - Remove user-selected output path option (fixed directory per session)
    - Verify Docker bind mount and file creation on host VPS
    - Debug and test complete download flow

    **Key Decisions:**
    | Decision | Choice | Rationale |
    |----------|--------|-----------|
    | Session isolation | Session-specific directories | Security, easy cleanup |
    | Output location | `/home/quarry/output/<session-id>/` | Single, predictable directory |
    | Download mechanism | HTTP endpoints on terminal server | Simple, reuses existing infra |
    | Quarry paths | Unified via env var (remove user selection) | Simplifies file tracking |
    | Frontend UX | FileDownloader modal | Non-intrusive, clear affordance |
    | File types allowed | All (JSON, JSONL, YAML, CSV, etc.) | Support all Quarry outputs |
    | Size limits | 10MB/file, 50MB/session | Prevent abuse |
    | Docker filesystem | Full tmpfs for `/home/quarry` | Low friction, flexibility |
    | Redundancy | Daily container restart at 04:00 | Clear accumulated tmpfs data |

    **Sub-tasks:**

    - **A.15.0–A.15.7 — Infrastructure setup** [Status: [x] ✅ Completed]

    - **A.15.8 — Configure Quarry output directory** [Status: [ ] Not Started]

      - Set `QUARRY_OUTPUT_DIR=/home/quarry/output/<session-id>/` before PTY spawn
      - Update `server/terminal/server.ts` session initialization
      - Pass env var to all Quarry modes (foreman, wizard, scout)
      - May require Quarry CLI flags or wrapper script
      - Expected outcome: All outputs land in session directory

    - **A.15.9 — Verify Docker bind mount and file creation** [Status: [ ] Not Started]

      - Verify bind mount in Docker container: `docker exec quarry-sandbox ls -la /home/quarry/output/`
      - Test file creation: `touch /home/quarry/output/<session-id>/test.txt`
      - Verify files visible on host VPS
      - Run actual Quarry command, confirm file on host

    - **A.15.10 — End-to-end download flow testing** [Status: [ ] Not Started]

      - Open `/demos/terminal` on production (quarry.russellbomer.com)
      - Run `quarry foreman` → complete guided tutorial
      - Verify FileDownloader lists generated files
      - Download file, verify contents
      - Test multiple file types (JSON, JSONL, YAML)

    - Dependencies: A.12
    - Status: [ ] 🔄 **Ready for Implementation** — Refined approach approved

18. **A.16 — Security audit for terminal demo** 🔄 READY FOR IMPLEMENTATION

    **Completed Items:**

    - [x] ✅ Verify Docker container isolation is robust (2025-12-03)
    - [x] ✅ Test for container escape vectors (2025-12-03)
    - [x] ✅ Confirm resource limits (CPU, memory, disk) are enforced (2025-12-03)
    - [x] ✅ Verify session timeout and cleanup works correctly (2025-12-03)
    - [x] ✅ Document security model in `server/terminal/README.md` (2025-12-03)

    **Refined Approach (2025-12-05):**

    - Implement command filtering at PTY input level (Option A)
    - Block `cd` commands targeting parent directories, root, or absolute paths
    - Allow normal navigation within session directory
    - Maintain Quarry functionality (foreman, wizard, scout modes)
    - Escalate to restricted shell (rbash) only if filtering gaps discovered during testing

    **Key Decisions:**
    | Decision | Choice | Rationale |
    |----------|--------|-----------|
    | Escape prevention | Command filtering (PTY input) | Simple, transparent, low risk to Quarry |
    | Threat model | Casual/accidental escapes | Docker isolation primary defense |
    | Blocked commands | `cd ..`, `cd /`, absolute paths | Most common escape vectors |
    | Shell restriction | Not initial approach | Escalate if filtering insufficient |
    | Logging | All blocked attempts | Debugging and monitoring |

    **Remaining Items (Ready to Implement):**

    - [ ] **A.16.6 — Implement command filtering for filesystem navigation**

      - Add PTY input filter in `server/terminal/server.ts`
      - Intercept `cd` commands before PTY processing
      - Parse target path; check if within session directory
      - Block attempts outside session directory with error message
      - Log all blocked attempts for debugging
      - Expected outcome: `cd ..`, `cd /`, `cd /etc` blocked; normal navigation works

    - [ ] **A.16.7 — Test directory traversal prevention from within terminal**

      - Attempt escapes: `cd ../..`, `cd /`, `cd /etc`, `cd /home/quarry`, `cd <relative-path>`
      - Verify blocked attempts produce error message
      - Verify user remains in session directory
      - Confirm: `ls /etc` still works (command filtering only catches cd)
      - Testing location: VPS terminal (quarry.russellbomer.com/demos/terminal)
      - Expected outcome: Casual escapes blocked; normal operations work

    - [ ] **A.16.8 — Evaluate restricted shell if filtering gaps discovered**

      - Only pursue if A.16.7 testing reveals gaps in command filtering
      - If needed: Configure rbash with whitelist, test all Quarry modes
      - Document decision and rationale in `server/terminal/README.md`
      - Test impact on foreman, wizard, scout functionality
      - Consider fallback approaches if rbash breaks Quarry

    - [ ] **A.16.9 — Document filesystem guardrails in README** _(NEW)_

      - Update `server/terminal/README.md` with security model
      - Explain cd filtering (what's blocked, what's allowed)
      - Note limitations (symlinks, absolute paths in other commands)
      - Provide rationale (casual escape prevention, Docker isolation primary defense)
      - List tested escape techniques (passing and failing)
      - Expected outcome: Clear documentation for future maintainers

    - Dependencies: A.11
    - Status: [ ] 🔄 **Ready for Implementation** — Approach approved, filtering strategy defined

19. **A.17 — Session lifecycle enhancement** 🔄 READY FOR IMPLEMENTATION _(NEW)_

    **Goal:** Improve session reset behavior on page load and allow inactivity timeout adjustment.

    **Current State:**

    - Inactivity timeout: 2 minutes (may be too short/long for user preference)
    - Page reload: Terminal retains previous session state (no fresh start)
    - On load: User must manually clear or restart

    **Refined Approach (2025-12-05):**

    - Reset terminal to initial state on page load (clear buffer, rerun Quarry banner/menu)
    - Session ID persists across reset (files remain downloadable)
    - Adjust inactivity timeout based on user preference
    - Automatic reset improves UX for demo use case

    **Key Decisions:**
    | Decision | Choice | Rationale |
    |----------|--------|-----------|
    | Page load reset | Automatic (clear + quarry command) | Clean slate UX, good for demos |
    | Session persistence | Preserve session ID for downloads | Files accessible after reset |
    | Timeout adjustment | Configurable (pending user preference) | Balances UX vs. resource cleanup |
    | Reset trigger | Page navigation to `/demos/terminal` | Not background/silent reset |

    **Sub-tasks:**

    - [ ] **A.17.1 — Adjust inactivity timeout**

      - Review current setting (2 minutes in `server/terminal/server.ts`)
      - Determine user preference: 5 min, 10 min, no timeout, other?
      - Update timeout logic in session management
      - Testing: Confirm timeout triggers cleanup after period of inactivity
      - Dependencies: None
      - Expected outcome: Sessions persist for appropriate duration

    - [ ] **A.17.2 — Implement page-load session reset**

      - Detect page load / new session in `DemoSessionProvider.tsx` or `TerminalDemo.tsx`
      - Behavior:
        1. Clear terminal output buffer (blank slate)
        2. Clear command history
        3. Re-initialize session directory
        4. Auto-run `quarry` command to display banner and menu
      - Where: Component mount lifecycle (useEffect with empty dependency array)
      - How: Send commands to PTY sequentially: `clear` → `quarry`
      - Expected outcome: Fresh Quarry menu on every page load

    - [ ] **A.17.3 — Test session reset flow**

      - Load `/demos/terminal` → verify Quarry banner and menu appear
      - Run commands, navigate around
      - Refresh page → terminal clears, banner reappears
      - Verify FileDownloader still works (session ID persists)
      - Verify files from previous session still downloadable
      - Testing location: VPS (quarry.russellbomer.com/demos/terminal)
      - Expected outcome: Clean UX, no files lost after reset

    - Dependencies: A.15, A.16 (for cleanup context)
    - Status: [ ] 🔄 **Ready for Implementation** — Approach approved, awaiting timeout preference

**Notes and Constraints:**

- If any A.x task fails, fix before proceeding
- Terminal must be production-ready for public use at launch
- Docker container provides security isolation for public terminal access
- Users can run quarry commands including web scraping and download outputs

---

### Phase B — Content & Feature Completion

**Goal:** Complete all content, add new project cards, implement resume download, and update footer.

**Status:** ⏸️ Blocked (67% complete)

**Scope:**

- Remove placeholder content
- Add real project cards
- New features: resume download, social links
- Copy refinement across all pages

**Tasks:**

1. **B.1 — Replace CLI Notes with Quarry on homepage**

   - Status: [x] ✅ Completed 2025-12-03
   - **Verified 2025-12-05**: `app/page.tsx` Work section shows Quarry card with Python/Typer/Rich/Pandas tags

2. **B.2 — Create NFL Analytics Dashboard project card**

   - **Scope revised:** Implemented as typed array in `app/work/page.tsx`
   - Status: [x] ✅ Already implemented
   - **Verified 2025-12-05**: Project with "Coming Soon" badge present

3. **B.3 — Create Simplytics API project card**

   - **Scope revised:** Implemented as typed array in `app/work/page.tsx`
   - Status: [x] ✅ Already implemented
   - **Verified 2025-12-05**: Project with "Coming Soon" badge present

4. **B.4 — Add X (Twitter) social link to footer**

   - Status: [x] ✅ Completed 2025-12-03
   - **Verified 2025-12-05**: XIcon and link present in Footer.tsx

5. **B.5 — Add Instagram social link to footer**

   - Status: [x] ✅ Completed 2025-12-03
   - **Verified 2025-12-05**: InstagramIcon and link present in Footer.tsx

6. **B.6 — Add resume download link to footer**

   - Add PDF to `public/` directory (user provides file)
   - Add download link/button in footer alongside social links
   - Dependencies: User provides resume PDF
   - Status: [ ] ⏸️ **Blocked — waiting for resume PDF**

7. **B.7 — Add resume download to Connect page**

   - Add download link/button to `app/connect/page.tsx`
   - Dependencies: B.6
   - Status: [ ] ⏸️ **Blocked — waiting for B.6**

8. **B.8 — Add resume download to TMI/About page**

   - Add download link/button to `app/tmi/page.tsx`
   - Dependencies: B.6
   - Status: [ ] ⏸️ **Blocked — waiting for B.6**

9. **B.9 — Complete/refine copy across all pages**
   - Review and finalize: Hero, About, Practice, Work, Connect sections
   - Refine `/writing` "Coming soon" copy
   - Ensure craftsman tone: thoughtful, dry wit, substantive
   - Dependencies: None
   - Status: [ ] ⏳ **Needs human review**
   - **Note 2025-12-05**: Copy exists and appears complete, but tone/voice is subjective — recommend human review to confirm or mark complete

**Notes and Constraints:**

- Resume PDF to be designed independently by user
- Coming Soon cards should be visually distinct but not obtrusive

---

### Phase C — Legacy Code Cleanup ✅ COMPLETE

**Goal:** Remove all unused authentication and payment code from the SaaS template.

**Status:** ✅ Complete (Verified 2025-12-05)

**Tasks:**

1. **C.1 — Delete `lib/auth/` directory**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: Directory does not exist

2. **C.2 — Delete `lib/payments/` directory**

   - Status: [x] ✅ Complete (directory did not exist)
   - **Verified 2025-12-05**: Directory does not exist

3. **C.3 — Remove auth-related database schema**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: `lib/db/schema.ts` contains only `contactSubmissions` and `activityLogs`

4. **C.4 — Full Stripe purge from codebase**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: No Stripe in package.json, .env.example clean

5. **C.5 — Remove orphaned imports and dead code**
   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: Middleware is pass-through only, build passes

---

### Phase D — Documentation Updates ✅ COMPLETE

**Goal:** Ensure all documentation accurately reflects current project state.

**Status:** ✅ Complete (Verified 2025-12-05)

**Tasks:**

1. **D.1 — Fix README.md route reference**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: README references `/work` and `/connect` correctly

2. **D.2 — Fix codebase-review date typo**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: File named `codebase-review-2025-12-02.md`

3. **D.3 — Update implementation-plan.md with completion status**

   - Status: [x] ✅ Completed 2025-12-04
   - **Verified 2025-12-05**: `visual-overhaul-implementation-plan.md` shows all phases complete

4. **D.4 — Update anchors.json scope if needed**

   - Status: [x] ✅ No changes needed (verified 2025-12-04)

5. **D.5 — Update interactive-demo-qa.md verification log**
   - Status: [x] ✅ Already complete (verified 2025-12-04)
   - **Verified 2025-12-05**: Contains 2025-12-03 entry with LCP/cold start metrics

---

### Phase E — Launch Preparation

**Goal:** Final verification and production deployment.

**Status:** ⏳ Not Started

**Dependencies:**

- Phase A complete (currently A.15, A.16 incomplete)
- Phase B complete (currently blocked on resume PDF)

**Tasks:**

1. **E.1 — Verify SEO metadata on all pages**

   - Check meta titles, descriptions, OG tags
   - Verify social sharing previews
   - Dependencies: Phase B complete
   - Status: [ ]
   - **Note 2025-12-05**: `lib/seo/meta.ts` buildMetadata() utility exists; all pages use it

2. **E.2 — Final production build**

   - Run `npm run build` and verify no errors
   - Check for TypeScript errors
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

**Status:** ⏳ Not Started

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
   - **Note 2025-12-05**: `.github/workflows/pr-validation.yml` exists for anchor/persona validation; need separate ci.yml for build pipeline

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
   - **Note 2025-12-05**: Current copy exists and is styled appropriately

**Notes and Constraints:**

- These are non-blocking; site can be live while addressing
- Custom illustrations remain deferred indefinitely
- Loading skeletons remain deferred

---

## 4. Priorities and Trade-offs

### Must-Have (Launch Blockers)

- ⚠️ Terminal demo fully functional on subdomain (A.15, A.16 need work)
- ✅ All pages render without errors
- ✅ Content complete (no Lorem ipsum or broken placeholders)
- ⏸️ Resume download working (blocked on PDF)
- ✅ Social links in footer

### Nice-to-Have (Can ship without)

- Perfect Lighthouse scores
- CI workflow
- Visual regression tests
- Loading skeletons

### Explicitly Deferred

- Search/filter for projects (only 4 cards, not needed)
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

## 5. Key File Locations

### Core Application Files

| File                          | Purpose                        |
| ----------------------------- | ------------------------------ |
| `app/page.tsx`                | Homepage with scroll sections  |
| `app/work/page.tsx`           | Projects showcase (4 projects) |
| `app/demos/page.tsx`          | Demo listing page              |
| `app/demos/terminal/page.tsx` | Terminal demo page             |
| `app/connect/page.tsx`        | Contact form                   |
| `app/tmi/page.tsx`            | Extended bio                   |
| `app/writing/page.tsx`        | Coming soon placeholder        |
| `app/not-found.tsx`           | 404 page                       |

### Terminal Demo Components

| File                                      | Purpose                 |
| ----------------------------------------- | ----------------------- |
| `server/terminal/server.ts`               | WebSocket + HTTP server |
| `server/terminal/README.md`               | Server documentation    |
| `components/demo/TerminalDemo.tsx`        | Terminal UI component   |
| `components/demo/FileDownloader.tsx`      | File download modal     |
| `components/demo/DemoSessionProvider.tsx` | Session context         |
| `components/demo/DemoErrorBoundary.tsx`   | Error handling          |

### Infrastructure

| File                                          | Purpose                  |
| --------------------------------------------- | ------------------------ |
| `deploy/docker/Dockerfile`                    | Quarry sandbox container |
| `deploy/docker/docker-compose.yml`            | Container orchestration  |
| `deploy/nginx/sites-available/portfolio.conf` | Nginx reverse proxy      |
| `deploy/terminal.service`                     | Terminal server systemd  |
| `deploy/systemd/quarry-restart.service`       | Daily container restart  |
| `deploy/systemd/quarry-restart.timer`         | Restart timer (04:00)    |

### Database & Schema

| File                | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `lib/db/schema.ts`  | Drizzle schema (contactSubmissions, activityLogs) |
| `lib/db/setup.ts`   | Database setup script                             |
| `lib/db/drizzle.ts` | Drizzle connection                                |

### Documentation

| File                                              | Purpose               |
| ------------------------------------------------- | --------------------- |
| `docs/fine-tuned-implementation-plan.md`          | Original plan         |
| `docs/visual-overhaul-implementation-plan.md`     | Visual design plan    |
| `docs/codebase-review-2025-12-02.md`              | Previous review       |
| `docs/interactive-demo-qa.md`                     | QA checklist          |
| `docs/architecture/ADR-0001-subdomain-routing.md` | Architecture decision |

---

## 6. Undocumented / Projected Requirements

### Missing Items for Production-Ready Delivery

| Category       | Item                                 | Status               | Priority |
| -------------- | ------------------------------------ | -------------------- | -------- |
| Infrastructure | PM2/systemd for Next.js app          | ❌ Missing           | High     |
| Monitoring     | Error logging service (Sentry, etc.) | ❌ Missing           | Medium   |
| Monitoring     | Uptime monitoring (99.9% KPI)        | ❌ Missing           | High     |
| Analytics      | Backend analytics implementation     | ❌ Deferred          | Low      |
| CI/CD          | Automated deployment pipeline        | ❌ Missing           | Medium   |
| Testing        | Unit/integration tests               | ❌ Missing           | Low      |
| SEO            | Sitemap generation                   | ⚠️ Script referenced | Low      |
| SEO            | robots.txt verification              | ⚠️ Not verified      | Low      |

### Best Practice Gaps

| Area          | Gap                             | Priority |
| ------------- | ------------------------------- | -------- |
| Documentation | No CHANGELOG.md                 | Low      |
| Security      | No SECURITY.md                  | Medium   |
| Testing       | No Playwright/Cypress e2e tests | Medium   |
| Backup        | Database backup strategy        | Medium   |

---

## 7. Performance Metrics (Verified)

Per `docs/interactive-demo-qa.md`:

| Metric                         | Target   | Actual        | Status              |
| ------------------------------ | -------- | ------------- | ------------------- |
| LCP (Largest Contentful Paint) | < 1500ms | 720ms         | ✅ Pass             |
| Cold Start to Live Mode        | < 800ms  | 167ms / 533ms | ✅ Pass             |
| Demo Error Rate                | < 1%     | Not measured  | ⚠️ Needs monitoring |
| Uptime                         | ≥ 99.9%  | Not measured  | ⚠️ Needs monitoring |

---

## 8. Recommended Next Actions

### Immediate (Unblock Launch)

1. **Complete A.15**: Debug end-to-end file download flow

   - A.15.8: Configure Quarry output directory (`/home/quarry/output/<session-id>/`)
   - A.15.9: Verify Docker bind mount and file creation on host VPS
   - A.15.10: Test complete download flow (Quarry command → file → download)

2. **Complete A.16**: Implement filesystem navigation guardrails

   - A.16.6: Add PTY input filter for `cd` commands
   - A.16.7: Test directory traversal prevention (blocked escapes verified)
   - A.16.8 (if needed): Escalate to restricted shell (rbash) if filtering gaps discovered
   - A.16.9: Document filesystem guardrails in README.md

3. **Complete A.17**: Enhance session lifecycle

   - A.17.1: Confirm inactivity timeout preference (currently 2 min)
   - A.17.2: Implement page-load reset (clear + Quarry banner)
   - A.17.3: Test session reset flow on VPS

4. **User Action**: Provide resume PDF for B.6-B.8

5. **Human Review**: Mark B.9 (copy refinement) complete or provide edits

### Pre-Launch (Phase E)

1. Run `npm run build` to verify no errors
2. Test all routes locally
3. Verify SEO metadata with social preview tools
4. Create PM2/systemd service for Next.js
5. Deploy and smoke test

### Post-Launch (Phase F)

1. Set up `.github/workflows/ci.yml`
2. Run Lighthouse audit
3. Add monitoring/alerting

---

## 9. Revision Log

| Date       | Change                                                                          | Author  |
| ---------- | ------------------------------------------------------------------------------- | ------- |
| 2025-12-02 | Initial plan created                                                            | —       |
| 2025-12-02 | Phase A expanded with deployment tasks                                          | —       |
| 2025-12-03 | Phase B & C tasks updated                                                       | —       |
| 2025-12-03 | A.15 expanded with detailed sub-tasks                                           | —       |
| 2025-12-05 | **Full codebase review and status verification**                                | Copilot |
| 2025-12-05 | A.15 marked incomplete — download flow needs work                               | Copilot |
| 2025-12-05 | A.16 expanded with filesystem guardrails tasks                                  | Copilot |
| 2025-12-05 | Added undocumented requirements section                                         | Copilot |
| 2025-12-05 | Added key file locations reference                                              | Copilot |
| 2025-12-05 | **REFINED PLAN — A.15, A.16, and A.17** _(Section walkthrough with user)_       | Copilot |
| 2025-12-05 | A.15: Locked approach (Quarry output to single session dir)                     | Copilot |
| 2025-12-05 | A.16: Locked approach (command filtering → rbash escalation)                    | Copilot |
| 2025-12-05 | **NEW — A.17: Session lifecycle enhancement** (page load reset, timeout tuning) | Copilot |
| 2025-12-05 | Overall Phase A status updated to "Ready to Complete"                           | Copilot |

---

**Next Priority:** Complete A.15 (document export) and A.16 (filesystem guardrails) to unblock Phase E launch preparation.
