# Portfolio Platform (Next.js)

A craftsman-themed personal portfolio built with **Next.js 15**, featuring scroll-driven animations, interactive demos, and a curated project showcase.

**Live Site: [https://russellbomer.com/](https://russellbomer.com/)**

## Features

- **Animated Landing Page** — Scroll-driven sections with Framer Motion, typewriter effects, and custom cursor
- **Projects Showcase** (`/projects`) — Filterable gallery of work with detailed case study pages
- **Interactive Demos** (`/demos`) — Sandboxed terminal and component demonstrations
- **Contact Form** (`/contact`) — Email integration via Resend API
- **Theme System** — 6-color craftsman palette with light/dark mode support
- **Subdomain Routing** — Demo isolation via wildcard DNS (see ADR-0001)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with Turbopack
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Postgres](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Email**: [Resend](https://resend.com/)

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
pnpm install
```

## Running Locally

Create your `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Set up the database:

```bash
pnpm db:setup
pnpm db:migrate
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project deploys to a DigitalOcean VPS with Nginx reverse proxy and wildcard SSL certificates. See:

- `deploy/README.md` — Deployment templates and setup instructions
- `docs/architecture/ADR-0001-subdomain-routing.md` — Subdomain routing architecture

For Vercel deployment, push to GitHub and connect via the Vercel dashboard. Required environment variables:

- `BASE_URL` — Production domain
- `POSTGRES_URL` — Database connection string
- `RESEND_API_KEY` — Email service API key
- `AUTH_SECRET` — Generate with `openssl rand -base64 32`
