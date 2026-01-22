# Claude Code Instructions (binding)

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
