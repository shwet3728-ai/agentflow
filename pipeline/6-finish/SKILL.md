---
name: finish
description: "Stage 6. Use once review is clean: green suite, integration menu (merge / PR / keep), worktree cleanup, ledger archive."
---

# Stage 6 — Finish

## 1. Green Suite

Run the FULL test suite on the tree you're about to integrate. Red → stage 4, not a menu. (A green run is the entry fee, not the ceremony.)

## 2. Worktree

Already inside a linked worktree? Continue. Else worktree cleanup below is a no-op.

## 3. Menu — present exactly, then wait

```
Implementation complete. What would you like to do?
1. Merge back to <base> locally
2. Push + create a Pull Request
3. Keep the branch as-is
```

Integration decision belongs to the human. On detached/externally-managed HEAD, drop option 1.

## 4. Execute

**Merge:** checkout base, pull, merge, run full suite ON THE MERGED TREE. Red → stop, keep branch + worktree, investigate (nothing was pushed; this is recoverable). Green → worktree `git worktree remove`, branch delete. Removal refused for uncommitted files → never `--force` on your own: show the human the file list, commit/move/delete per their pick.

**PR:** push, open against the base the branch is named for — confirm the base if it isn't obvious. Keep the worktree for review iteration.

**Keep:** state it plainly, ledger it.

**Discard:** only on explicit ask. It permanently deletes branch + commits. Demand typed confirmation `discard` — not "yes", not "sure". Then cleanup + `git branch -D`.

## 5. Archive

Ledger `Finish: merged to <base> | PR <url> | kept <branch>` + a final block:
- Rulings I made (every `ruling:` line, in order, each with its cost)
- Deferred minors (every minor line)
The final message is the only place your on-the-human's-behalf calls reliably reach them — make both lists complete.
