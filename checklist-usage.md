# Deployment Checklist Usage (For AI & Copilot Instructions)

This document is intended to be referenced from GitHub Copilot / AI instructions (e.g., `.github/copilot-instructions.md` or repository‑level AI settings). It defines how AI agents must treat `deployment-checklist.md` when working in this repository.

## Purpose

- `deployment-checklist.md` is the **source of truth** for determining whether the portfolio is ready to deploy or safe to modify in ways that affect production behavior.
- It operationalizes the vision, requirements, and schedule captured in:
  - `docs/phase-1-initiation-&-planning/1.1–1.4.txt`
  - `docs/phase-2-requirements-&-analysis/2.1.txt`
  - `docs/ai-guidelines.md` and `ai/anchors.json`
- This `checklist-usage.md` file tells AI agents how to use the checklist when planning and executing work.

## Mandatory Behavior for AI Agents

When you (an AI assistant, agent, or tool) are working in this repository, **you must** follow these rules:

1. **Always consult the deployment checklist for launch‑ or infra‑adjacent work.**

   - If a user asks about deployment, launch readiness, production issues, DNS/TLS, or environment configuration, you must open and read `deployment-checklist.md` before proposing changes or a plan.
   - Treat unchecked critical items in the checklist as blockers unless the user explicitly states they are intentionally ignoring them.

2. **Use the checklist to structure your plan and explanations.**

   - When proposing work that touches deployment, infrastructure, interactive demos, or SEO, map your plan to relevant sections of `deployment-checklist.md`.
   - Example: “This work primarily affects **Section 2: Interactive Demos** and **Section 7: Infrastructure, Deployment, and Operations** of `deployment-checklist.md`.”

3. **Call out checklist items you are verifying or changing.**

   - When you complete a task, state which checklist bullets are being satisfied, updated, or intentionally left open.
   - If you cannot verify an item (e.g., you cannot actually run a production build), be explicit about that limitation.

4. **Do not recommend production launch if critical items remain unchecked.**

   - If the user asks, “Is this ready to launch?” you must answer in terms of the checklist: which items appear satisfied from the code/docs, and which still require manual verification.
   - You may not simply say “yes” without referencing `deployment-checklist.md` and acknowledging any remaining gaps.

5. **Respect phase and scope documents.**

   - When you interpret or extend the checklist, keep it aligned with:
     - Vision/scope/schedule: `docs/phase-1-initiation-&-planning/1.1–1.4.txt`
     - Functional requirements: `docs/phase-2-requirements-&-analysis/2.1.txt`
     - AI behavior: `docs/ai-guidelines.md`
   - If you see a conflict between the checklist and these documents, call it out instead of silently choosing one.

6. **Do not silently weaken the checklist.**
   - You may suggest refining, splitting, or clarifying checklist items, but you should not remove or materially relax them unless the user explicitly requests it and acknowledges the trade‑offs.
   - If you propose such a change, clearly label it as a **change to the checklist itself**, not just a code change.

## How to Use These Rules in Copilot Instructions

If you are configuring GitHub Copilot or another AI assistant for this repo, you can adapt the following guidance into your instructions file:

> **Deployment & Launch Guidance for AI**
>
> - Treat `deployment-checklist.md` as the canonical deployment and launch gate for this repository.
> - Before proposing or implementing any change related to deployment, infrastructure, environment configuration, DNS/TLS, production incidents, or launch readiness, open and read `deployment-checklist.md`.
> - When answering questions or writing plans about such topics, reference the relevant sections of the checklist explicitly (for example: “This relates to Section 5: SEO, Social, and Discoverability”).
> - If the user asks whether the system is ready to launch, respond in terms of the checklist: list which items you can confirm from code/docs and which require manual verification. Avoid simple yes/no answers without that mapping.
> - Do not recommend launching to production if any critical checklist items are clearly unmet, unless the user explicitly accepts that risk, and you clearly document which items are being skipped and why.
> - Keep your recommendations aligned with `docs/phase-1-initiation-&-planning/1.1–1.4.txt`, `docs/phase-2-requirements-&-analysis/2.1.txt`, and `docs/ai-guidelines.md`. If you detect inconsistencies between these sources and the checklist, highlight them and suggest how to reconcile them.

You may copy/paste or lightly edit the block above into `.github/copilot-instructions.md` or a similar configuration file so that Copilot and other agents consistently respect the deployment checklist.

## When the Checklist Changes

- If `deployment-checklist.md` is updated (e.g., new sections, relaxed constraints, additional checks), AI agents should assume the **latest version supersedes prior guidance**.
- When you notice substantial edits to the checklist, summarize them in your own words before proceeding with further deployment‑related changes, so the user can confirm shared understanding.

## Non‑Deployment Work

- For purely local, non‑deployment tasks (e.g., refactoring a component, updating project copy, tweaking internal styles), you are not required to reference the checklist.
- However, if such changes may affect any checklist item (for example, altering navigation, SEO metadata, or the demos page), you should still consider whether a quick checklist review is appropriate.

---

In short: **`deployment-checklist.md` is your deployment bible.** Any time your work even smells like launch, infra, or production behavior, read it, reference it, and use it to shape your plan and recommendations.
