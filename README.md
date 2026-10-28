# Agentflow

One manifest → plugin manifests for Claude Code, Codex, Cursor, and any `AGENTS.md` harness. A **spec → plan → tasks → execute → review → finish** pipeline as auto-triggering skills, with a **committed ledger** that survives context compaction.

Combines what works from superpowers (skill engine + TDD discipline), spec-kit (spec-first gates), taskmaster (task contracts), BMAD (roles folded into stages), Agent OS (team conventions) — plus two things none of them ship: a **plugin compiler** (one `manifest.json` → every harness manifest) and a **committed cross-session ledger**. Zero telemetry.

---

## Install (for users)

Requirements: Node ≥ 18 for the CLI. For plugin installs, no Node needed.

### Claude Code

```bash
/plugin marketplace add shwet/agentflow
/plugin install agentflow
```

Verify: start a fresh session and say "Let's build a todo CLI" — stage 1 (spec) should answer with one question, not code.

### Codex CLI / Codex App

Until listed on the OpenAI official marketplace (a one-line PR to `openai/plugins`, the same route superpowers used), install from this repo:

```bash
/plugins
# search: agentflow → Install Plugin
```

or, if your build supports URL install:

```bash
/plugins install https://github.com/shwet/agentflow
```

### Cursor

```bash
/add-plugin agentflow
```

or search "agentflow" in the plugin marketplace.

### Any other harness (Gemini CLI, Copilot, Kimi, OpenCode, …)

Anything that reads `AGENTS.md` or accepts a skills folder works without a plugin:

```bash
npx -y github:shwet/agentflow#main init .
```

Then follow the one-time setup below. Skills live in `pipeline/` + `skills/`; harnesses discover them via `AGENTS.md` load-order or their own skills directory — copy the two folders into `~/.agents/skills/` (Codex/Copilot/Gemini cross-runtime alias) if you prefer a global install.

### Update

```bash
git pull && npm run build   # re-emits all harness manifests from manifest.json
agentflow init . --check    # any harness: re-reads conventions + skills (no version to manage)
```

Plugin-managed installs (Claude/Codex/Cursor) update via the harness's own plugin-update command.

### Uninstall

Remove the plugin via your harness's plugin UI; for AGENTS.md installs, `rm -rf .agentflow AGENTS.md` (the ledger commits are history — keep them).

---

## One-time project setup

```bash
agentflow init .        # writes .agentflow/ledger.md, .agentflow/conventions.md, AGENTS.md
```

- edit `.agentflow/conventions.md` — team standards every stage inherits
- the ledger is **committed**: it survives compaction, crashes, and `git clean`
- commitment contract: every gate/prompt logs to `.agentflow/ledger.md`; after compaction the agent re-reads ledger + `git log` before doing anything

## The pipeline

```
1-spec → 2-plan → 3-tasks → 4-execute → 5-review → 6-finish
```

- Skills auto-trigger; the agent checks for them before ANY action, including clarifying questions.
- Hard gates: nothing is built before the spec is approved; nothing claimed done without fresh evidence.
- Roles are stage-bound, not separate agents: analyst asks in 1-spec, architect plans in 2-plan, reviewer gates in 5-review.
- Every task is a contract: files, interfaces, `done-when` (machine-checkable), `stop-if`.
- Three meta-rules nobody else ships: **committed ledger** (compaction-proof), **context budget guard** (returns "resume next task" instead of dying deep in context), **3-fix breaker** (3 failed fixes = architecture problem, stop for a human).

## For contributors / building

```bash
npm test   # 3 tests: emits all manifests, rejects malformed skills, rejects bad manifests
agentflow build             # valid manifest → 5 emitted files (4 harnesses)
agentflow init <dir>        # scaffold a consuming project
agentflow version
```

One manifest (`manifest.json`) → `.claude-plugin/` (plugin + marketplace), `.codex-plugin/`, `.agents/plugins/`, `.cursor-plugin/`, all derivative. New skill = `mkdir skills/<name>/` + `SKILL.md` with `name`/`description` frontmatter; the build validator enforces it.

Repo layout:

```
manifest.json        single source of truth
bin/agentflow.js     CLI: build | init | version
compiler/build.js    manifest → 5 harness manifests
compiler/test.js     tests
templates/           ledger.md, AGENTS.md, conventions.md — stamped by init
skills/              6 meta skills (bootstrap, ledger, verify, debugging, writing-skills, diagnosing)
pipeline/            the 6 stages
```

MIT license — full attribution chain in [NOTICE.md](NOTICE.md). Distinct skill text; structural conventions inspired by the MIT-licensed obra/superpowers.
