---
name: review
description: "Stage 5. Use once every task contract is complete: one whole-branch review of the diff against plan + spec, findings gated by severity."
---

# Stage 5 — Review

## Do

1. **Package the diff:** `git merge-base <base> HEAD` → `git log --oneline`, `git diff --stat`, `git diff` to a file. Reviewer reads the file, not your narration.
2. **Dispatch a fresh reviewer** (most capable model you can; this is the one judgment seat of the run). Inputs: diff file, plan path, spec path, ledger's rulings verbatim so it can weigh them (never instruct it what to ignore).
3. No fresh subagent available? Do it yourself as a separate careful pass, then disclose in the final message: self-authored review is weaker; the human decides if that's enough.

## Severity Gate (reviewer's labels are input, you are the gate)

Re-grade by **effect on a reasonable user of this software** — not by whether the spec mentions the trigger. A reviewer who graded a finding Minor "because the spec was silent" graded the spec, not the human.

- **Critical / Important** → ONE fix pass, each fix TDD-verified (test reproduces the finding → red → fix → green → whole suite). No second review pass afterward: the covering test already answers "addressed"; the green suite answers "broke nothing".
- **Minor** → ledger `minor (deferring): <one-liner>` + final message under "Deferred minors". Minors never enter the fix pass.
- **You decline a finding** → that's a ruling: `Final: ruling: <finding> -- <why code stands> -- <cost if wrong>` — the human sees it in the report.
- **"Cannot verify from diff"** items → verify yourself with real command output, or they stay open findings.

## Gate Exit

Report: verdict, fixed list w/ test names, deferred minors, rulings made. Ledger `Review: N fixed, M minor (deferring) <one-liners>`. Clean → stage 6-finish.
