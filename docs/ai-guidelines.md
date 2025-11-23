# AI Agent Guidelines

Source-of-truth vision & goals: `docs/phase-1-initiation-&-planning/1.1.txt`
Structured anchors: `ai/anchors.json`

## Purpose

Ensure every AI-assisted change advances the portfolio’s credibility, performance, maintainability, scalability, or iteration speed while serving defined personas (client, manager, developer) and respecting success metrics & technical KPIs.

## Core Anchors (Do Not Redefine)

- Vision: Scalable interactive portfolio SaaS with modular Next.js + Tailwind + ShadCN foundation enabling future e-commerce, content, and advanced demos.
- Personas: Client (fast credibility), Manager (transparent depth), Developer (inspiration & patterns).
- Activation Metrics: Demo viewed, case study read, contact initiated.
- Retention Metrics: Return visits, newsletter engagement, repeat page interactions.
- Technical KPIs: Latency <1500ms initial load; demo error rate <1%; uptime ≥99.9%.

## Decision Framework

1. Link change to a persona or KPI.
2. Evaluate performance budget impact (latency / size / error risk).
3. Preserve modularity (avoid monolithic components, prefer composition).
4. Document rationale (commit message or PR description).
5. Abort or request clarification if persona/KPI alignment unclear.

## Guardrails

- Do NOT introduce hidden dependencies or store secrets in code.
- Avoid large refactors without explicit approval.
- Reference rather than duplicate vision text; keep single source of truth.
- Keep demo environments isolated; prevent cross-leak of experimental code into core unless approved.
- Respect error & latency budgets; profile if uncertain.

## Required Checks Before Merge (AI or Human Assisted)

- [ ] Persona / KPI stated in description.
- [ ] Performance impact considered (bundle, network, runtime).
- [ ] No secrets / credentials / tokens added.
- [ ] Maintains or improves code clarity (naming, structure, no dead code).
- [ ] Documentation updated if behavior/architecture meaningfully changes.

## Prompt Construction Guidelines

Include: Persona or KPI + intent + constraint.
Avoid: Vague verbs ("optimize") without target metric.

Examples:

- GOOD: "Implement lazy loading for demo terminal to keep TTFB < 1500ms (tech KPI) for manager persona evaluating architecture."
- BAD: "Improve terminal performance."

## Commit Message Pattern (Conventional Commit)

Format: `type(scope): summary`
Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
Summary: imperative, ≤72 chars, reference persona/KPI if relevant.

Example:
`perf(demo-terminal): defer heavy CLI init to keep load <1500ms (tech KPI)`

## PR Template Key Sections (suggested)

1. Purpose & Persona/KPI alignment.
2. Implementation summary (architecture notes).
3. Performance considerations (numbers or hypothesis + next measurement).
4. Risk & rollback plan.
5. Validation steps.

## Lint & Style Expectations

- TypeScript strict mode, functional React components.
- Tailwind for utility styling; extract components when repeated >2 times.
- Avoid unused code; remove dead modules early.
- Keep functions small and single-purpose.

## Performance & Reliability

- Monitor bundle size; prefer dynamic imports for large, non-critical demo modules.
- Use incremental static regeneration or edge rendering where applicable.
- Log demo errors centrally; ensure error boundaries in interactive areas.

### Performance Metric Definitions

- Primary Latency Metric: LCP (Largest Contentful Paint) target < 1500ms on representative devices.
- Cold Start Budget (interactive demo init): < 800ms to usable CLI terminal.
- Error Rate Metric: `demo_error_rate` (<1% user demo sessions encountering uncaught errors per 24h).
- Uptime Metric: `platform_uptime` ≥ 99.9% monthly.
- Measurement Tools: Web Vitals (client), RUM aggregation, synthetic uptime checks.

### Instrumentation & Events

Standard analytics events (see `lib/analytics/events.ts`):

- `demo_view` – fired when a user loads an interactive demo.
- `case_study_read` – fired on full case study completion (e.g. scroll / time threshold).
- `contact_initiated` – fired when user begins a contact/hiring flow.
- `newsletter_subscribed` – fired on confirmed newsletter opt-in.
  Each new feature must specify events added/updated in PR description.

### Roadmap Deferral Rule

Do not implement non-MVP roadmap milestone features (`ecommerce`, `content`, `advanced-demos`) without an ADR referencing milestone and justification. MVP scope changes require persona/KPI mapping.

### Error Budget & Escalation

- Error Budget: 1% demo error rate per rolling 24h.
- Breach (>=1% for 2 consecutive intervals): initiate regression issue, prioritize fix over new features.
- Critical Breach (>=2% single interval): immediate rollback of recent demo-related deployments.
- Post-incident: add ADR documenting root cause & mitigation.

## Documentation Strategy

- Architecture decisions: ADR-style in `docs/architecture/` (create as needed) referencing anchors.
- Demos: Each interactive demo gets a `README` with purpose, tech choices, KPI impact.

## When to Ask for Clarification

- Persona or KPI conflict (e.g., feature helps developer but harms latency).
- Vision expansion (e-commerce) requested without enabling prerequisite infrastructure.
- Uncertain security implications (auth/session changes, cross-domain demos).

## Escalation Path

If a required check fails repeatedly or KPI degradation detected:

1. Revert or isolate change.
2. Document regression in a tracking issue.
3. Propose corrective action with persona/KPI alignment.

## Minimal Agent Operating Procedure (AOP)

1. Read anchors (`ai/anchors.json`).
2. Validate task alignment.
3. Plan minimal scoped change; avoid drift.
4. Implement & self-review against checklist.
5. Summarize alignment in commit/PR.

---

Maintainers: Update this file ONLY when vision/KPI/persona definitions change. Increment version field in `ai/anchors.json` accordingly.
