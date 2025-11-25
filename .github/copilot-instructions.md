# GitHub Copilot Instructions – `portfolio`

These instructions guide GitHub Copilot (and similar AI agents) when working in this repository. They complement the in‑repo docs and anchors.

Core reference docs:

- `docs/ai-guidelines.md`
- `ai/anchors.json`
- `docs/phase-1-initiation-&-planning/1.1–1.4.txt`
- `docs/phase-2-requirements-&-analysis/2.1.txt`
- `deployment-checklist.md`
- `checklist-usage.md`

Copilot should treat these as the main sources of truth for vision, scope, requirements, and deployment readiness.

---

## 1. General Behavior

- Align suggestions with the portfolio vision and target audience described in the phase‑1/phase‑2 docs.
- Prefer small, explicit, well‑typed changes over large, speculative refactors.
- Keep changes consistent with the existing stack (Next.js App Router, React, TypeScript, Tailwind, shadcn/ui).
- Respect file layout and existing patterns before introducing new ones.
- When you’re unsure about intent, propose options and ask for clarification instead of guessing.

---

## 2. Documentation and Anchors

- Before significant architectural, UX, or infra work, glance at:
  - `docs/ai-guidelines.md` for overall AI/assistant expectations.
  - `ai/anchors.json` for any anchor instructions tied to specific files or features.
  - Relevant phase‑1/phase‑2 docs to confirm that new work supports stated goals.
- If you see divergence between code and docs, highlight it and suggest how to reconcile them.

---

## 3. Deployment & Launch Guidance for AI

> **Deployment & Launch Guidance for AI**
>
> - Treat `deployment-checklist.md` as the canonical deployment and launch gate for this repository.
> - Before proposing or implementing any change related to deployment, infrastructure, environment configuration, DNS/TLS, production incidents, or launch readiness, open and read `deployment-checklist.md`.
> - When answering questions or writing plans about such topics, reference the relevant sections of the checklist explicitly (for example: “This relates to Section 5: SEO, Social, and Discoverability”).
> - If the user asks whether the system is ready to launch, respond in terms of the checklist: list which items you can confirm from code/docs and which require manual verification. Avoid simple yes/no answers without that mapping.
> - Do not recommend launching to production if any critical checklist items are clearly unmet, unless the user explicitly accepts that risk, and you clearly document which items are being skipped and why.
> - Keep your recommendations aligned with `docs/phase-1-initiation-&-planning/1.1–1.4.txt`, `docs/phase-2-requirements-&-analysis/2.1.txt`, and `docs/ai-guidelines.md`. If you detect inconsistencies between these sources and the checklist, highlight them and suggest how to reconcile them.

Additionally, follow the detailed rules in `checklist-usage.md` whenever you touch deployment, infra, or launch‑adjacent work.

---

## 4. Code Contributions

When generating or modifying code:

- Favor type‑safe, idiomatic React/Next.js patterns (App Router, `app/` structure).
- Keep environment‑specific values in env vars, not hardcoded.
- Ensure new components and utilities live alongside related files (e.g., `components/`, `lib/`, `app/` routes) to match existing organization.
- For the terminal demo, respect the separation between the Next.js app and `server/terminal/server.ts` backend.

If you add or change behavior that may affect any item in `deployment-checklist.md` (navigation, contact, SEO, demos, infra, etc.), call that out explicitly in your explanation so humans can re‑evaluate readiness.

---

## 5. Non‑Deployment Work

For purely local/productivity tasks (styling tweaks, small refactors, copy edits):

- You don’t need to run the full deployment checklist.
- Still, avoid regressing accessibility, SEO, or navigation where possible; if in doubt, mention which checklist items might be impacted so they can be re‑validated later.

---

By following these instructions and the referenced docs, Copilot should reinforce this repo’s design and deployment discipline rather than bypass it.
