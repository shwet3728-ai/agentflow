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
- **Reviewer is wrong** → push back with technical reasoning (code/tests proving it), then re-adjudicate. Same-author-default gives no protection: disagreements are still rulings, just ones backed by evidence.
- **"Cannot verify from diff"** items → verify yourself with real command output, or they stay open findings.

## Gate Exit

Report: verdict, fixed list w/ test names, deferred minors, rulings made. Ledger `Review: N fixed, M minor (deferring) <one-liners>`. Clean → stage 6-finish.

## Receiving Findings (receiving half)

1. READ the full feedback before reacting. 2. Restate each requirement in your own words or ask. 3. Verify against the codebase before implementing ANY item — check it's true here, checks it doesn't break existing behavior, check YAGNI (grep for actual usage before "implementing properly" a suggestion about an unused path). 4. Unclear item? Stop and ask: items may be related, partial understanding = wrong implementation.
No performative agreement — never "You're absolutely right!", "Great point!", thank-yous. Correct feedback gets: "Fixed. <what changed>." Wrong feedback gets technical reasoning + push back. Pushback that turns out wrong? State the correction factually, move on.
Implementation order for multi-item feedback: blocking/security → simple → complex, one item at a time, each verified.

## Parallel Investigators (fix pass)

Several independent failures in the fix pass (different files/subsystems, no shared state)? One investigator subagent each, dispatched in ONE message to run concurrently. Implementers still never run in parallel — investigators read, implementers write. After they return: check for conflicting edits, run the full suite, spot-check the fixes.
