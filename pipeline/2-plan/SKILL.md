---
name: plan
description: "Stage 2. Use once the spec is approved: architecture and an implementation plan an executor who has never seen this repo can follow."
---

# Stage 2 — Plan

Write a plan for an engineer who has not seen this codebase or this spec. They know the project's idiom, not your decisions. **A plan is the set of decisions the executor cannot make alone.** Document exactly those: which files, which names/signatures, which spec values pin which test. DRY. YAGNI.

## Do

1. **Architecture first** (architect role, 2-3 sentences): approach + why it fits the spec's chosen approach.
2. **File structure before tasks.** Where every new/changed file lives and its one responsibility. Files that change together stay together. Follow repo patterns; don't restructure uninvited.
3. **Global Constraints** (verbatim from spec, one line each: version floors, naming, platform rules).
4. **Review Focus:** the 4-5 inputs/failure modes the spec *implies* but no task's tests cover, most user-bite-y first. Each gets its test in its owning task.
5. **Tasks**, 2-5 min each, each independently testable. Fold setup/scaffolding into the task that needs it. Cut anything not in the spec.
6. Save: `docs/agentflow/plans/YYYY-MM-DD-<feature>.md`, committed.

## Step Quality

Each step = one unambiguous action with a checkable result:

| Step type | Must contain | Must not contain |
|---|---|---|
| test | test name + assertions as code, spec's exact values | nothing TBD |
| code | exact signature, file, pinned values; a body only for an algorithm the tests don't determine | a body the signature already determines |
| verify | the command + the output that proves it passed | "run tests and eyeball it" |
| reference | "uses Task 3's `foo()` per its Interfaces block" | a copy of Task 3's code |

A line that decides nothing ("handle edge cases", "add validation", a function no task defines) is a bug in the plan. A plan longer than the code it describes is a transcript, not a plan.

## Self-Review (run it yourself, fix inline, no re-review)

1. Spec coverage: every spec requirement maps to ≥1 task
2. Step scan: every step = exactly one reasonable thing to write; no truthful-but-empty lines
3. Type consistency: `clearLayers()` in Task 3 doesn't become `clearFullLayers()` in Task 7
4. Review Focus: every line has its owning test
5. Proportion: plan ≲ spec; bodies are mostly absent

## Gate Exit

"Plan saved at <path>. Review it, then choose how to run it: **subagent-per-task** (fresh review each task, most thorough) or **inline** (I do every task, one whole-branch review at the end, cheapest)." Recommend one, one sentence why. On approval + choice: ledger `Plan: written <path> (N tasks)` → stage 3-tasks.

Shortcut: trivial plan with ≤3 obviously-contracted tasks may fold stage 3-tasks — say so, and put the contracts in the plan itself.
