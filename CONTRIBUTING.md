# Contributing

This repository uses explicit scope and constraints anchors to keep the MVP focused and maintainable.

## Anchors & Sources

- Vision & Personas: `docs/phase-1-initiation-&-planning/1.1.txt`
- Scope & Constraints: `docs/phase-1-initiation-&-planning/1.2.txt`
- Organization & Collaboration: `docs/phase-1-initiation-&-planning/1.3.txt`
- Schedule & Milestones: `docs/phase-1-initiation-&-planning/1.4.txt`
- Structured Anchors: `ai/anchors.json`
- Guidelines: `docs/ai-guidelines.md`

## VS Code Setup

- Accept workspace recommendations from `.vscode/extensions.json`.
- Todo Tree highlights scope tags in the gutter.
- Settings expose anchors via:
  - `portfolio.aiAnchorsPath`: `ai/anchors.json`
  - `portfolio.aiGuidelinesPath`: `docs/ai-guidelines.md`
  - `portfolio.scopePath`: `docs/phase-1-initiation-&-planning/1.2.txt`
  - `portfolio.organizationDocPath`: `docs/phase-1-initiation-&-planning/1.3.txt`
  - `portfolio.scheduleDocPath`: `docs/phase-1-initiation-&-planning/1.4.txt`

### Branch tasks (quick actions)

- Run via Command Palette (`Ctrl+Shift+P`) → `Tasks: Run Task`:
  - `git: create feature branch` → prompts for name, creates `feature/<name>` from `main`.
  - `git: create hotfix branch` → prompts for name, creates `hotfix/<name>` from `main`.
  - These reinforce the branching strategy without adding process overhead.

## Scope Tags (use in comments)

- `MUST`: MVP must-have items.
- `NICE`: Nice-to-have items.
- `FUTURE`: Post-MVP roadmap items.
- `OUTOFSCOPE`: Explicitly out for MVP.
- `ASSUMPTION`: Business/technical assumption guiding decisions.
- `CONSTRAINT`: Hosting/stack/arch limitations.
- `SPIKE`: Proof-of-concept or technical investigation.

Example:

```ts
// MUST: Contact form for client inquiries (1.2 scope)
// CONSTRAINT: DigitalOcean VPS; subdomain routing needed
```

## Organizational Tags (use in comments where relevant)

- `ORG`: Note related to project organization choices.
- `ROLE`: Clarify which hat a change touches (product/dev/ops/QA/docs/agents).
- `AI-INPUT`: Prompts/specs given to an AI agent.
- `AI-OUTPUT`: AI-generated code/artifact requiring manual review.
- `AI-REVIEW`: Results of manual review or items to double-check.
- `PR`: Notes tied to PR description requirements.
- `SECURITY-REVIEW`: Security considerations, especially for interactive demos.
- Schedule tags: `MILESTONE`, `PHASE`, `TIMEBOX`, `EXIT-CRITERIA`, `DEP`, `LAUNCH-CHECK`

Example:

```ts
// AI-INPUT: Terminal demo prompt spec for file ops behavior
// AI-OUTPUT: Generated component — pending AI-REVIEW for security & standards
```

## PR & CI Expectations

Include these sections in PR description (enforced by CI):

- `Persona:` — client | manager | developer
- `KPI:` — e.g., LCP, error rate, activation metric
- `Scope:` — MUST | NICE | FUTURE and which item(s)
- `Constraints:` — hosting/stack/assumptions considered

See `.github/pull_request_template.md` and workflow `.github/workflows/pr-validation.yml`.

Minimal AI output review acknowledgment is required in PRs (see checklist); the detailed checklist lives in `ai/anchors.json` under `rolesAndResponsibilities.aiAgentPrinciples.reviewChecklist`.

## Snippets

Schedule/context snippets available (`.vscode/schedule.code-snippets`):

- `milestoneTag`, `phaseTag`, `timeboxTag`, `exitCriteriaTag`, `depTag`, `launchCheckTag`
  Additions recommended: persona and KPI tags (will appear as `personaTag`, `kpiTag`).

## ADRs

Significant architectural choices should be documented as ADRs in `docs/architecture/` using `ADR-0000-template.md`.

## Commit Messages

Use Conventional Commits. Example:

```
perf(demo-terminal): defer init to keep LCP < 1500ms
```
