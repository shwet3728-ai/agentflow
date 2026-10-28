---
name: diagnosing-agentflow
description: "Use when an agentflow session went wrong — a skill didn't fire, a stage was skipped, work repeated, plan ignored, or it got slow or expensive — and the human wants an evidence report of what happened."
---

# Diagnosing Agentflow

Reconstruct what a session actually did and report it with evidence. You report; you don't prescribe fixes in the report.

```
EVERY FINDING CITES EVIDENCE. No citation, no finding.
Numbers come from the record or a command you ran, never memory.
```

## Workflow

1. **Intake, one question at a time.** Until you can write: which session(s), which turn range, what the human expected, what happened, and the observable they care about (repeated work, skipped gate, wall-clock, tokens). "It took too long" is a complaint, not a problem statement — ask what would have counted as fast enough.
2. **Evidence, in this order:**
   - `.agentflow/ledger.md` — which stages/tasks/ledger lines exist (or are missing)
   - `git log` / `git diff` — what actually landed vs. what the ledger claims
   - harness transcript/history, if readable — skill firings, tool calls per turn, compaction events
3. **Analyze against the five failure classes:**
   - stage skipped or gate opened without approval (ledger says Spec: approved but git has no spec file)
   - skill never loaded (no "Using…" announcement when one was due)
   - work repeated (a task's commits exist twice)
   -ruadherence drift (findings not in any `ruling:` line)
   - compaction fallout (work right after a compaction event that contradicts later entries in the ledger)
4. **Report** to the human: timeline of the relevant turns with citations, the failure class(es) hit, and where the pipeline lost the thread. Every number computed or read this session.
5. **Bug report** only on request: propose the issue text, get approval of the exact wording, then file.

## Hard Rules

- Read-only: never modify session files
- Findings are descriptive; fixing is a separate decision after the human reads the report
- If no evidence exists for an event (nothing ledgered, nothing committed), say so plainly — that gap is itself a diagnostic finding about the ledger protocol
