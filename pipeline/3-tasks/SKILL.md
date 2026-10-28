---
name: task-contracts
description: "Stage 3. Use once the plan is approved: turn tasks into dispatchable contracts with done-when and stop-if. This file is what executors read — not the whole plan."
---

# Stage 3 — Task Contracts

The contract is the dispatch unit. Each one carries everything an executor needs *for that task* and nothing else. They already saw the plan's architecture; don't re-paste it.

## Contract Format

One section per task in `docs/agentflow/contracts/<plan-name>.md`:

```
### Task N: <name>
Files:
- modify  exact/path/file.py:120-148
- create  tests/exact/test_name.py
- test    tests/exact/test_name.py::test_name

Consumes: <what earlier tasks produce — exact signatures>
Produces: <what later tasks rely on — exact signatures>

done-when:
- <command> -> <exact expected output, e.g. "3 passed">
- <observable behavior exists>         (each criterion independently checkable)

stop-if:
- <condition that makes THIS task unwise to continue, e.g. "suite baseline was not green">
- <scope leaks: the honest fix touches an interface the contract didn't name>
```

## Quality Rules

1. **done-when is machine-checkable.** A command and its output, or an observable that a watcher can confirm. "Code looks right" is not a criterion.
2. **stop-if is where honesty lives.** Name the two ways an executor shouldn't soldier on: broken baseline, and scope creep. Without these, an executor hides drift by "finishing" a different task.
3. **Interfaces are typed exactly** — contract writers copy signatures from the plan, they do not re-derive them.
4. **No contract exceeds a fresh context.** A task longer than one context cannot be executed by one subagent — split it.
5. Self-check: does every contract's `done-when` prove progress toward the plan's Review Focus? Are there gaps between contracts — an interface produced by Task 4 but consumed by Task 2's Tests? Then the order is wrong; fix it here, not in stage 4.

## Ledger + Exit

Contract table written + committed. Ledger `Tasks: contracted <path> (N tasks)`. Load stage 4-execute.
