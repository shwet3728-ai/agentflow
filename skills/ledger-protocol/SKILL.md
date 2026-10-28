---
name: ledger-protocol
description: "Use whenever writing to or reading from .agentflow/ledger.md — the durable, committed cross-session state file that survives context compaction."
---

# Ledger Protocol

The ledger is the single record of what has been decided and completed. Conversation memory dies (compaction, sessions, CSS crashes). The ledger and `git log` do not.

## What It Owns

- Pipeline location: which stage you are in
- Approval: specs, plans, task contracts that the human signed off
- Per-task completions, and the test evidence that earned them
- Every ruling: decisions you made on the human's behalf, each with why + cost-of-wrong
- Deferred minors: review findings you chose not to fix (name one-liner)

## When To Write

- Entering a new stage: `Stage <N>: entered <name>` rides along with your first action in it — not as its own tool call
- Gate approval: same message as telling the human, not after
- Finishing a task: same message as the commit, `Task <N>: complete (commits <base7>..<head7>, tests: <cmd> -> <result>)`
- Every ruling: `Task <N>: ruling: <what> -- <why> -- <cost if wrong>`
- Review outcome: clean, or `N fixed, M minor (deferring) <one-liners>`

## Rules

1. **It is committed.** `.agentflow/ledger.md` is part of your branch. `git clean` does NOT destroy it (unlike git-ignored scratch dirs). Commit it along with everything else.
2. **Trust ledger + git log over your own memory.** After compaction, prior memory may lie. Task line = done. Re-doing a ledgered-complete task is an error.
3. **One line, no essays.** Detail lives in the artifact (spec/plan/contract), not the ledger.
4. **Never capture intent into the ledger.** The ledger holds facts that happened, not plans-to-someday.
5. **After a compaction or a fresh session:** read the ledger before reading anything else, and verify claimed-complete against git log.
