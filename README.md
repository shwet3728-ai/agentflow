# Agentflow

One manifest → plugin manifests for every harness. A spec→plan→tasks→execute→review→finish pipeline as auto-triggering skills, plus a **committed** ledger that survives context compaction.

Combines what works from: superpowers (skill engine + TDD discipline), spec-kit (spec-first gates), taskmaster (task contracts), BMAD (roles folded into stages), Agent OS (team conventions) — and two things none of them have: a **plugin compiler** (one manifest → all harness manifests) and a **committed cross-session ledger**.

## Pipeline

```
1-spec → 2-plan → 3-tasks → 4-execute → 5-review → 6-finish
```

- Skills auto-trigger; the agent checks for them before ANY action, including clarifying questions.
- Hard gates: nothing is built before the spec is approved; nothing claimed done without fresh evidence.
- Roles are stage-bound, not separate agents: analyst asks in 1-spec, architect plans in 2-plan, reviewer gates in 5-review.
- Every task is a contract: files, interfaces, `done-when` (machine-checkable), `stop-if`.
- Every event lands in `.agentflow/ledger.md` — committed, so `git clean` can't kill it and a fresh session resumes exactly where the last one died.

## Install

Requires Node ≥ 18.

```bash
npm test               # verify
npm run build          # emits .claude-plugin/ + .codex-plugin/
agentflow init <your-project-dir>   # writes .agentflow/ledger.md + AGENTS.md
```

- **Claude Code:** push this repo to GitHub, then `/plugin marketplace add <you>/agentflow` and `/plugin install agentflow` (marketplace structure-compatible with obra-style plugins).
- **Codex CLI/App:** publish via the official plugin marketplace (superpowers got listed the same way — a PR to `openai/plugins`). Until then, agents can follow `AGENTS.md` load-order directly, no plugin needed.
- Any harness that reads `AGENTS.md` (Cursor, Copilot, etc.) works with just `agentflow init` + the skills folder — point it at `skills/` and `pipeline/`.

## Use it in a project

1. `agentflow init .`
2. Tell your agent: "build X". Stage 1 answers with one question and routes everything else.
3. Put your team's standards in `.agentflow/conventions.md` — every stage inherits them.

## Repo layout

```
manifest.json        single source of truth (name/version/skills/interface)
bin/agentflow.js     CLI: build | init
compiler/build.js    manifest → .claude-plugin/plugin.json + .codex-plugin/plugin.json
compiler/test.js     tests: emit both manifests; fail on malformed skill
templates/           ledger.md, AGENTS.md — stamped by `init`
skills/              meta skills: agentflow-start (bootstrap), ledger-protocol, verify, systematic-debugging, writing-skills, diagnosing-agentflow
pipeline/            the six stages, one SKILL.md each
```

MIT license. Distinct skill text; structure conventions are inspired by the MIT-licensed obra/superpowers.
