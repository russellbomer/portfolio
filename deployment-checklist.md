# Deployment Checklist (MVP Launch)

This checklist encodes the minimum bar for calling the portfolio “launch‑ready” and for making any deployment that materially affects production behavior.

Use this document alongside:

- `docs/phase-1-initiation-&-planning/1.1–1.4.txt` (vision, scope, schedule)
- `docs/phase-2-requirements-&-analysis/2.1.txt` (functional requirements)
- `docs/ai-guidelines.md` and `ai/anchors.json` (AI behavior/guardrails)
- `docs/terminal-demo.md`, `server/terminal/README.md` (interactive demo backend)

Treat all unchecked critical items as **blocking** for a production launch unless there is an explicit, written decision to accept the risk.

---

## 1. Portfolio & Content

- [ ] **Home page narrative is current**
      Hero, tagline, and introduction match the positioning in `1.1–1.3` (who you are, what you offer, ideal client).

- [ ] **Projects list is complete for MVP**
      At least **3–5** representative projects are present under `content/projects/` and surfaced on `/projects`.

- [ ] **Each project has a clear story**
      For every published project JSON:

  - [ ] `title`, `slug`, `excerpt`, `role`, `tech` fields present and accurate.
  - [ ] At least one screenshot or visual with meaningful alt text.
  - [ ] Copy clearly explains problem → approach → outcome.

- [ ] **Draft or unused content is hidden**
      Any unfinished project has `published: false` (or is removed) and does **not** appear on `/projects` or in the sitemap.

---

## 2. Interactive Demos

### 2.1 Local PTY + Demo Mode

- [ ] **Demo page renders without errors**
      `/demos` loads successfully in dev and production builds.

- [ ] **Terminal demo works in live PTY mode locally**

  - [ ] `npm run dev:terminal` starts without crashing (on Windows and non‑Windows dev machines).
  - [ ] `GET http://127.0.0.1:<TERMINAL_PORT>/health` returns `ok`.
  - [ ] The terminal on `/demos` connects in “Live” mode and accepts basic commands.

- [ ] **Graceful fallback to demo mode**
      When the backend is down or `node-pty` is unavailable, `/demos` clearly shows demo mode, runs the scripted walkthrough, and never hard‑crashes the page.

### 2.2 WSS Proxy / Production Exposure

- [ ] **Nginx (or equivalent) WS proxy configured**
      `location /ws` (or equivalent) forwards WebSocket upgrade requests to the terminal backend port, with:

  - [ ] `Upgrade` and `Connection` headers set correctly.
  - [ ] `X-Forwarded-*` and `Host` preserved.

- [ ] **Staging WSS connectivity verified**
      In a staging or production‑like environment:

  - [ ] `NEXT_PUBLIC_TERMINAL_WS_URL` points to a `wss://.../ws` endpoint.
  - [ ] Browser devtools show a stable `101 Switching Protocols` WS connection.
  - [ ] The terminal remains in Live mode without unexpected disconnects.

- [ ] **Access strategy is defined**
      There is an explicit decision on who may access the live terminal in production (e.g., only you, only certain IPs, or public demo). If restricted, the enforcement mechanism (auth, IP allow‑list, etc.) is documented and implemented.

---

## 3. Contact & Lead Generation

- [ ] **Contact form submits successfully**
      End‑to‑end test from `/contact` in a production‑like environment results in a delivered email.

- [ ] **SMTP configuration is complete**
      Environment variables set for the target environment (values not checked into git):

  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_SECURE`
  - [ ] `SMTP_USER` / `SMTP_PASS` (if required)
  - [ ] `CONTACT_EMAIL_FROM`
  - [ ] `CONTACT_EMAIL_TO`

- [ ] **Anti‑spam basics in place**

  - [ ] Honeypot field is wired and respected.
  - [ ] Basic rate limiting or abuse mitigation strategy is documented for `/api/contact` (even if not yet implemented, the risk/plan is written down).

- [ ] **Error paths are user‑friendly**
      On transient SMTP failure, the UI shows a clear error and does not silently drop submissions.

---

## 4. Navigation, Layout, and UX

- [ ] **Primary nav is correct and stable**
      Header links to `/`, `/projects`, `/demos`, `/contact` work across all pages and viewports.

- [ ] **Mobile menu functions**
      Hamburger menu toggles correctly on small screens and dismisses on navigation.

- [ ] **Footer metadata is accurate**
      Copyright year, name, and external links (e.g., GitHub, Contact) are up to date.

- [ ] **No obvious broken links**
      Manual click‑through of main nav and project cards reveals no 404s or obviously missing sections.

---

## 5. SEO, Social, and Discoverability

- [ ] **Base URL configured**
      `NEXT_PUBLIC_SITE_URL` is set for staging/production and reflects the canonical host (no trailing slash).

- [ ] **Metadata builder used on core routes**
      Home, projects list, project detail, demos, and contact pages use `lib/seo/meta.ts` or equivalent for consistent titles, descriptions, canonical URLs, and Open Graph/Twitter data.

- [ ] **Sitemap and robots are correct for target host**

  - [ ] `scripts/generate-sitemap.mjs` has been run for the environment.
  - [ ] `public/sitemap.xml` URLs use the correct domain.
  - [ ] `public/robots.txt` references the correct sitemap URL.

- [ ] **Social preview looks acceptable**
      At least one key page (home, a flagship project) has been tested with a link preview (e.g., Twitter/X, LinkedIn, or an OG debugger) and the preview image/title/description look intentional.

---

## 6. Design System & Accessibility

- [ ] **Theme tokens are internally consistent**
      `portfolio-theme-alpha.json` (and any active theme file) validates against `schemas/theme.ts` and loads without runtime errors in `/theme-lab`.

- [ ] **Contrast audit passes for primary pairs**

  - [ ] `scripts/contrast-audit.mjs` has been run.
  - [ ] `contrast-audit-output.json` shows at least AA‑level contrast for:
    - `foreground` vs `background`
    - `primary-foreground` vs `primary`
    - `secondary-foreground` vs `secondary`
    - `accent-foreground` vs `accent`
    - `destructive-foreground` vs `destructive`
    - `card-foreground` vs `card`
    - `popover-foreground` vs `popover`
    - `muted-foreground` vs `muted` (normal text or “muted” semantics).

- [ ] **Core flows usable with keyboard only**
      Manually verify on at least one browser:

  - [ ] Tab order is logical across header, main content, and footer.
  - [ ] Focus outlines are visible for interactive elements.
  - [ ] Contact form and project navigation can be operated via keyboard alone.

- [ ] **Alt text and landmarks reviewed**
  - [ ] Primary images and project screenshots have descriptive `alt` text.
  - [ ] Page structure uses appropriate headings and landmarks (e.g., `main`, `nav`, `footer`).

---

## 7. Infrastructure, Deployment, and Operations

- [ ] **Environment configuration documented**
      A short, up‑to‑date list of required env vars per environment (dev/stage/prod) exists (this file or another doc) and matches actual deployment configs.

- [ ] **Build and start commands verified**
      For the target environment:

  - [ ] You can run the production build and start commands without error.
  - [ ] Any PM2/systemd/Docker configuration is checked into `deploy/` or documented.

- [ ] **DNS and TLS are in place**

  - [ ] Main portfolio domain resolves correctly (A/AAAA/CNAME records).
  - [ ] TLS certificate is valid and not near expiry.
  - [ ] If wildcard subdomains are used for demos, DNS and certificates cover them.

- [ ] **Terminal backend lifecycle understood**

  - [ ] You know where and how `server/terminal/server.ts` runs in production (separate process, container, etc.).
  - [ ] Restart/rollback procedures are documented (for both the Next.js app and the terminal backend).

- [ ] **Basic observability exists**
  - [ ] There is at least one way to view application logs in production.
  - [ ] There is a simple check for uptime (e.g., pinging `/` and `/health`).
  - [ ] You know what you’ll look at first if something breaks after deploy.

---

## 8. Risk Acknowledgements / Explicit Deviations

If you choose to deploy with some items unchecked, write down which ones and why.

- [ ] **Documented exceptions**
      A short note (here or in a release note) lists any intentionally skipped checklist items and the rationale (e.g., “Terminal demo disabled in production for now; feature flag off”).

- [ ] **Rollback plan exists**
      There is a clear, simple way to undo the deployment if a major issue appears (e.g., revert to previous app version, turn off a feature flag, or disable DNS for a demo subdomain).

---

## 9. Final Pre‑Launch Sanity Pass

Do this right before promoting to production or announcing a launch.

- [ ] Home page looks correct on at least one desktop and one mobile viewport.
- [ ] `/projects` and at least one project detail page read well and feel representative of your work.
- [ ] `/demos` loads, and any demos that are not production‑ready are clearly marked or disabled.
- [ ] `/contact` works end‑to‑end and sends to an inbox you actively monitor.
- [ ] No obvious placeholder text, “lorem ipsum”, or TODO markers are visible.
