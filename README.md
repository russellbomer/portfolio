# Portfolio Platform (Next.js)

This repository powers a personal portfolio platform built with **Next.js** featuring interactive demos, authentication-ready foundations, Stripe integration scaffolding, and a project showcase dashboard.

**Live Site: [https://russellbomer.com/](https://russellbomer.com/)**

## Features

- Marketing landing page (`/`) with animated Terminal element
- Pricing page (`/pricing`) which connects to Stripe Checkout
- Dashboard pages with CRUD operations on users/teams
- Basic RBAC with Owner and Member roles
- Subscription management with Stripe Customer Portal
- Email/password authentication with JWTs stored to cookies
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
- Activity logging system for any user events

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

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

[Install](https://docs.stripe.com/stripe-cli) and log in to your Stripe account:

```bash
stripe login
```

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following user and team:

- User: `test@test.com`
- Password: `admin123`

You can also create new users through the `/sign-up` route.

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

You can listen for Stripe webhooks locally through their CLI to handle subscription change events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Testing Payments

To test Stripe payments, use the following test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

## Going to Production

When you're ready to deploy the portfolio platform to production, follow these steps:

### Set up a production Stripe webhook

1. Go to the Stripe Dashboard and create a new webhook for your production environment.
2. Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`).
3. Select the events you want to listen for (e.g., `checkout.session.completed`, `customer.subscription.updated`).

### Deploy to Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it.
3. Follow the Vercel deployment process, which will guide you through setting up your project.

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `BASE_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment.
3. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
4. `POSTGRES_URL`: Set this to your production database URL.
5. `AUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.

## Other Templates

While this template is intentionally minimal and to be used as a learning resource, there are other paid versions in the community which are more full-featured:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
