# CLAUDE.md

Before doing anything:
1) Read: `docs/IMPLEMENTATION_PLAN.md`, `docs/GUARDRAILS.md`, `docs/STATUS.md`.
2) Restate: current stage, files you expect to change, and acceptance commands you will run.

Execution rules:
- Execute EXACTLY ONE stage per run.
- Do NOT do any item marked MANUAL (YOU). If encountered, STOP and ask.
- Do NOT run commands without asking for approval. When asking, include the exact command(s) and why.

Hard stops (must be manual):
- Any credentials/secrets/keys/token rotation or handling
- DigitalOcean/Vercel/Hostinger/GitHub settings changes
- DNS changes and TLS issuance (certbot/ACME/DNS-01)
- Any destructive git ops: history rewrite (filter-repo/BFG) or force push

Terminal demo security invariants:
- Never spawn `bash` (or any shell) for interactive sessions.
- Never pass user input to shell interpretation (`bash -c`, `exec(...)`, etc.).
- Each session must run in a sandbox container, not on the host.
- Session containers must run with `--network none` (or equivalent), plus read-only FS, cap drop, no-new-privileges, and resource limits.
- Do not add `privileged: true`, `network_mode: host`, or mount `/var/run/docker.sock` unless I explicitly approve. If needed, STOP and ask.

End-of-stage requirements:
- Show `git diff --stat` and key diffs.
- Run the stage acceptance checks from `docs/GUARDRAILS.md` and paste outputs.
- Commit with message `stageN: <short>`.
- Update `docs/STATUS.md`.
- STOP.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio platform (russellbomer.com) built with Next.js 15. Features scroll-driven animations, interactive CLI-style demos on subdomains, and a craftsman-themed design. Deploys to DigitalOcean VPS with Nginx reverse proxy.

## Commands

```bash
npm run dev              # Start dev server (Turbopack)
npm run dev:terminal     # Start terminal WebSocket server (port 4000)
npm run build            # Production build
npm run db:setup         # Initialize database
npm run db:migrate       # Run Drizzle migrations
npm run db:generate      # Generate migration from schema changes
npm run db:studio        # Open Drizzle Studio GUI
```

## Architecture

### Stack
- **Framework**: Next.js 15 with Turbopack, PPR, and client segment cache enabled
- **Database**: PostgreSQL with Drizzle ORM (schema in `lib/db/schema.ts`)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Animations**: Framer Motion for scroll-driven effects

### Key Directories
- `app/` - Next.js App Router pages (home, work, demos, connect, etc.)
- `components/` - React components organized by concern (layout, motion, ui, theme, demo)
- `lib/` - Utilities: `db/` (Drizzle), `analytics/`, `content/`, `motion/`, `seo/`
- `server/terminal/` - WebSocket terminal server using node-pty
- `deploy/` - Nginx configs, systemd units, Docker setup, certbot
- `docs/architecture/` - ADRs for significant decisions

### Subdomain Demo Architecture
Interactive demos run on isolated subdomains (e.g., `quarry.russellbomer.com`). Nginx handles wildcard DNS routing and TLS termination. Next.js rewrites subdomain root to `/demos/terminal`. See `docs/architecture/ADR-0001-subdomain-routing.md`.

### Terminal Demo
The `/demos/terminal` page connects to a WebSocket server (`server/terminal/server.ts`) that spawns a PTY session. Features session isolation, file download endpoints, and security filters for directory traversal.

## Decision Framework

Before making changes, identify:
1. Which persona this serves (client, manager, developer)
2. Which KPI it affects (LCP < 1500ms, demo error rate < 1%, uptime 99.9%)

Reference `ai/anchors.json` for structured guidance and `docs/ai-guidelines.md` for detailed policies.

## Conventions

- **Commits**: Conventional Commits format (`feat`, `fix`, `perf`, `docs`, etc.)
- **TypeScript**: Strict mode, functional React components
- **Styling**: Tailwind utility-first; extract components when patterns repeat >2 times
- **Code comments**: Use scope tags (MUST, NICE, FUTURE, OUTOFSCOPE, CONSTRAINT, SPIKE)

## Environment Variables

Required for local development (copy `.env.example` to `.env.local`):
- `POSTGRES_URL` - Database connection string
- `RESEND_API_KEY` - Email service (contact form)
- `BASE_URL` - Production domain

Terminal server environment (for `npm run dev:terminal`):
- `TERMINAL_PORT` - WebSocket port (default: 4000)
- `TERMINAL_OUTPUT_DIR` - Session file storage
- `TERMINAL_QUARRY_MODE` - Enable Quarry CLI mode
