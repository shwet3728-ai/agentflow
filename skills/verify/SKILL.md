---
name: verify
description: "Use before ANY completion or success claim: tests pass, bug fixed, task done, 'it works now', or satisfaction. Evidence before assertion, always."
---

# Verify

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

You haven't run the command in this turn? You cannot state the claim as fact. If any of these are true — you skipped it, plain and simple.

## The Gate

1. IDENTIFY: which command proves this claim
2. RUN it: fresh, complete, whole-suite (not only your file)
3. READ the full output: exit code, failure count, warnings
4. Was the expected output there? No = state what happened, actually. Yes = claim, with evidence.
5. ONLY THEN: make the claim.

Skip a step = lying, not verifying.

## Claim -> Evidence

| Claim | Needed |
|-------|--------|
| "tests pass" | the suite's own output: 0 failures, this run |
| "bug fixed" | the original symptom's failing test now green |
| "it works" | you used it / observed it run |
| "agent finished" | you check the diff, not the agent's report |
| "story complete" | each spec requirement checked one by one |

## Blacklist

"should pass" — "probably fine" — "looks right" — "tests will catch it" — "'Done!' before running anything" — delegating verify to an agent and believing it.

If a test suite isn't reachable (no test harness), verify the equivalent: run the code, use the feature, or state plainly that nothing verified it.
