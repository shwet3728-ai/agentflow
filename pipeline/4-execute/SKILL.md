---
name: execute
description: "Stage 4. Use once task contracts exist: run them in order with TDD, one ledger commit per task, no check-ins between tasks."
---

# Stage 4 — Execute

Continuous execution: no "shall I continue?" between tasks — the human picked a lane and the contracts are the work. **Rulings, not stalls:** only four things stop you — destructive/irreversible ops, security actions, side effects outside this worktree (push/merge/publish), or contracts so broken every path is a guess. Everything else: decide, ledger it as a ruling, keep going.

## Setup (once)

1. **Worktree** (or skip if already isolated): native tool if your harness has one; else `git worktree add .worktrees/<branch> -b <branch>` (verify `.worktrees/` is gitignored first). Run project setup + full test suite for a clean baseline. Red baseline → stop-if for Task 1, tell the human.
2. Read the contract file; one ledger line per completed contract begins empty.
3. Subagent tool available AND contracts mostly independent → **subagent mode** (fresh subagent per task, task review each). Else → **inline mode** (TDD is the per-task gate, one final whole-branch review).

## Per Task

1. `git rev-parse HEAD` → record BASE. Load Task N's contract only (never the whole plan file).
2. **TDD, no exceptions:**
   - RED: write the failing test. **Run it. Watch it fail for the right reason.** A test that passes before the code exists is a finding about the test.
   - GREEN: minimal code to pass. Run again. Read the output.
   - REFACTOR: clean, stay green.
   - Suite: run the WHOLE project suite before the ledger line — your file green is not the suite green.
   - Code before test → delete it. Rewriting is cheaper than bolting tests on.
3. **Contract wrong?** (command can't work / interface mismatch): smallest change satisfying the spec, ledger `Task N: ruling: <finding> -- <decision> -- <cost>`, continue. Code wrong → systematic-debugging.
4. **Completion contract** (verify skill governs): every named test ran, output read, done-when shown by real output. Anything short → the task is not done.
5. Ledger, in the same message as the commit: `Task N: complete (commits <base7>..<head7>, tests: <cmd> -> <result>)`. Never move on while a Critical/Important finding is unfixed and unparked.

## Subagent Mode Extras

- Dispatch: one line of where the task fits, the contract path, interfaces from earlier tasks, report path. Never paste accumulated history — a fresh subagent needs its task + interfaces + global constraints. Nothing else.
- Task review: after the implementer reports, dispatch a reviewer (contract + report + diff as files; global constraints as attention lens). Spec compliance AND quality, both verdicts or no pass. Never pre-judge findings for the reviewer. Implementer self-review ≠ review.
- Fix loop: re-review only the fix's scope, not the whole task. Round count matters less than: does each round change *outcome* (new failing test actually ran)? Two rounds with no new information → adjudicate, park with ruling.
- Cheapest model per role: mechanical tasks → cheap; integration → standard; the FINAL branch review → most capable model, explicitly (an omitted model silently defaults to the session's model).
- Never dispatch two implementers in parallel. Never let a subagent spawn its own reviewer.

## Context Budget (the anti-compaction rule)

Context below ~25% remaining: finish the current task, ledger it, then tell the human "fresh session will resume from the ledger — stage 4, task N+1." Never start a new task deep in the red zone. NEVER rely on remembering anything across a compaction: the ledger + `git log` are the only truth.

## Exit

All contracts done → stage 5-review (whole-branch review there).
