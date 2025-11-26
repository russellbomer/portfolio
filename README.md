# Portfolio Platform (Next.js)

This repository powers a personal portfolio site built with **Next.js** featuring:

- Themed landing page and project showcase
- Interactive demos (including a feature‑flagged terminal prototype)
- A JSON-driven theme system with live editing tools
- SEO (metadata builder, sitemap, robots) and accessibility improvement targets

Legacy SaaS dashboard and Stripe subscription code has been fully removed to focus the scope on portfolio + demos. Authentication, RBAC, billing, and multi-tenant constructs that previously existed are now out-of-scope for this iteration and can be reintroduced later in a lean, optimized form.

**Live Site: [https://russellbomer.com/](https://russellbomer.com/)**

## Current Feature Set

- Marketing landing page (`/`) with hero + themed UI
- Projects list (`/projects`) and per-project detail pages (statically generated)
- Demos hub (`/demos`) with xterm-based terminal demo (feature gated)
- Styleguide views (colors, theme editor, theme lab) backed by JSON theme tokens
- SEO: dynamic metadata, Open Graph/Twitter tags, sitemap + robots generation
- Image fallback handling for project assets

## Removed / Out-of-Scope (Former Legacy)

These were deleted to reduce maintenance cost and cognitive load:

- Pricing + Stripe Checkout & Customer Portal integration
- Dashboard (teams, members, subscription, security settings)
- Webhook and billing server routes

To restore any legacy capability, reimplement with modular boundaries (e.g. `/billing` package, isolated API routes, and feature flags) rather than reviving the deleted `legacy/` directory.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, experimental PPR)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) + Tailwind
- **Theming**: JSON HSL tokens → CSS variables via custom providers
- **Content**: Static JSON project definitions + TypeScript validation
- **Build/Tooling**: TypeScript, Postbuild sitemap script
- **Analytics (planned)**: Web Vitals beacon endpoint (to be added)

## AI Agent Guidelines

This repo is configured for AI-assisted development. All agents and contributors should follow:

- Guidelines: `docs/ai-guidelines.md`
- Anchors (vision, personas, KPIs): `ai/anchors.json`
- VS Code settings: `.vscode/settings.json` (includes anchor paths)

Recommended setup in VS Code:

- Accept workspace-recommended extensions from `.vscode/extensions.json` (Copilot, ESLint, Prettier, Tailwind, GitLens, Conventional Commits, Spell Checker, Pretty TS Errors).
- Keep commit messages in Conventional Commit format and include persona/KPI context when relevant.
- Treat `docs/phase-1-initiation-&-planning/1.1.txt` as the source-of-truth for project vision.

## Anchors Overview

The project uses structured anchor domains to prevent decision drift and guide both human and AI contributors:

| Domain                           | Purpose                                                            | Source Files                                                    |
| -------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Vision & Personas                | Why we exist, who we serve, KPIs & differentiators                 | `docs/phase-1-initiation-&-planning/1.1.txt`, `ai/anchors.json` |
| Scope & Constraints              | MVP vs NICE vs FUTURE, out-of-scope, assumptions, spikes           | `docs/phase-1-initiation-&-planning/1.2.txt`, `ai/anchors.json` |
| Organization & Collaboration     | Roles (hats), AI agent review principles, branching, commit policy | `docs/phase-1-initiation-&-planning/1.3.txt`, `ai/anchors.json` |
| Schedule & Milestones (MVP Week) | Day-by-day milestones, spikes, phase mapping, exit criteria        | `docs/phase-1-initiation-&-planning/1.4.txt`, `ai/anchors.json` |

Key VS Code settings exposing these anchors:

```jsonc
"portfolio.aiAnchorsPath": "ai/anchors.json",
"portfolio.aiGuidelinesPath": "docs/ai-guidelines.md",
"portfolio.scopePath": "docs/phase-1-initiation-&-planning/1.2.txt",
"portfolio.organizationDocPath": "docs/phase-1-initiation-&-planning/1.3.txt",
"portfolio.scheduleDocPath": "docs/phase-1-initiation-&-planning/1.4.txt"
```

Comment tags (Todo Tree) surfacing anchor context:
`MUST`, `NICE`, `FUTURE`, `OUTOFSCOPE`, `ASSUMPTION`, `CONSTRAINT`, `SPIKE`, `ORG`, `ROLE`, `AI-INPUT`, `AI-OUTPUT`, `AI-REVIEW`, `PR`, `SECURITY-REVIEW`, `MILESTONE`, `PHASE`, `TIMEBOX`, `EXIT-CRITERIA`, `DEP`, `LAUNCH-CHECK`.

Example:

```ts
// MILESTONE: day-2 (build)
// EXIT-CRITERIA: demo reachable via subdomain
// AI-OUTPUT: generated terminal component – pending review
// PERSONA: client
// KPI: LCP < 1500ms
```

## Getting Started

```bash
git clone https://github.com/russellbomer/portfolio.git
cd portfolio
npm install
npm run dev
```

Open http://localhost:3000 to view the site.

### Interactive Terminal Demo

The terminal demo is feature-flagged and backed by a standalone PTY/WebSocket server. See `server/terminal/README.md` for full details.

Quick local run:

```powershell
# Terminal server (use 4001 if 4000 is busy)
$env:TERMINAL_PORT='4001'
npm run dev:terminal

# Next.js, wired to the server
$env:NEXT_PUBLIC_FEATURE_TERMINAL='true'
$env:NEXT_PUBLIC_TERMINAL_WS_URL='ws://127.0.0.1:4001/ws'
npm run dev
```

If `node-pty` fails to build (Windows toolchain), installs still succeed and the client falls back to demo mode. Run `npm run pty:rebuild` after fixing toolchain to enable live PTY.

For quick answers, see `docs/faq.md` (Terminal Demo section).

### Environment Variables

For current portfolio functionality minimal env configuration is required. Future demos (terminal backend, analytics) will introduce additional vars documented when implemented.

### Theme Workflow

1. Edit `portfolio-theme-final.json` or create a new theme JSON.
2. The `AppThemeProvider` ingests tokens and maps HSL triplets to CSS variables (`--background`, `--primary`, etc.).
3. Styleguide pages visualize scale, contrast, and allow experimentation.
4. Components consume tokens via `hsl(var(--token))` pattern.

### Reintroducing Auth/Billing Later

Add as isolated feature modules with explicit boundaries (e.g. `features/auth`, `features/billing`) and guard with feature flags & environment toggles.

## Production Deployment

Deploy with Vercel or a Next-compatible host:

1. Push branch to GitHub.
2. Connect repo in Vercel.
3. Set any required env vars (future: terminal backend, analytics endpoint).
4. Ensure `postbuild` sitemap script runs (already defined in `package.json`).

Add caching & image optimization as needed; current build is flat and static except partially prerendered project detail route.

## Future Roadmap (High-Level)

- Terminal backend PTY/WebSocket bridge
- Contact form + email delivery
- Web Vitals analytics endpoint
- Contrast + accessibility audits & refinements
- Modular reintroduction of auth/billing if required

---

Historical Stripe/auth code was removed on YYYY-MM-DD (replace with actual date) to streamline focus. Reintroduce capabilities only behind feature flags and isolated modules.
