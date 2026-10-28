---
name: agentflow-start
description: "Load at conversation start and after every compaction, before responding to ANY input including clarifying questions: routes the request into the pipeline by reading the ledger first."
---

# Agentflow Start

Bootstrap routing — never performs the real work itself.

## What To Do

1. Verify `AGENTS.md` and `.agentflow/ledger.md` exist. If not, tell the user to run `agentflow init <project-dir>`. No ledger, no pipeline — step up (fix it) or riff.
2. Read the ledger, top to bottom. If it lists tasks done, work is resumed mid-flight — jump to 4-executing to resume, NOT the 1-spec stage. The ledger is the source of truth.
3. Route the user's turn to the matching stage:

| Request | Route to |
|---------|----------|
| "build X / add feature / plan X" | 1-spec |
| spec exists (from the ledger), no plan | 2-plan |
| plan exists, no task contracts | 3-tasks |
| contracts exist, tasks undone | 4-execute |
| implementation done, gate to review | 5-review |
| review clean | 6-finish |
| something's broken | systematic-debugging |
| bugfix claimed done / wanting to say "works" | verify |

4. Announce: "Using agentflow, entering stage <N>: <name>." Then load and follow the stage's SKILL.md exactly.

## Small-Work Shortcut

Work that is: 1-3 files, under ~15 minutes, no behavior change worth a spec — you may skip stages 1-3.
State in one line: skip reason, do the work commit + ledger, log it.
If it turns out larger: stop, go back to 1-spec.

## Hard Gate

Never announce work stages as done — even "about done" — unless the task tracks in the ledger.
Never skip the reset that stage rules own. Read the stage SKILL.md, don't recall it.
