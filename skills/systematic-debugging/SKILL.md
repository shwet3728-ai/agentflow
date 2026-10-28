---
name: systematic-debugging
description: "Use when any bug appears, regardless of size: reproduce it first, then hypothesize, then fix. Never patch a symptom."
---

# Systematic Debugging

Four phases. Skipping phase 1 is the most common bug: "fixed" without reproducing it.

## Phase 1 — Reproduce

Write a failing test or script that reproduces what's wrong. If you cannot reproduce it, you're not debugging — you're guessing. Rule out: is it deterministic? what inputs? what's the version?

## Phase 2 — Understand

Read the failing code path and what it depends on. Root cause before the patch. Common trap: the reported symptom's location isn't the bug's location.
- One cause usually: which invariant broke? What condition was assumed vs. what actually holds?
- Can you state the bug in one sentence: "<thing> does <wrong> instead of <right> because <reason>". If not, keep reading.

## Phase 3 — Fix, Minimal

Smallest change that addresses the root's cause, not the symptom.
- Multi-layer system? Instrument each layer boundary (what enters, what exits, state at each) and run ONCE to find where it breaks — before touching anything.
- Each fix attempt: hypothesis -> minimal change -> re-run reproduction. Did the result change?
- If a fix needs a second fix to still pass, your model of it is wrong — stop and re-read.
- Never edit the reproduction expected-output to match what happened.

## Phase 4 — Verify

- The reproduction now passes.
- Full suite is green (read the output).
- Add a permanent regression test if the reproduction was a script or a REPL session.
- Log: bug -> root cause -> fix -> test, one line in the ledger.

## Stop-Tiers

- Fix #3 failed? **STOP. That's not a hypothesis problem, that's architecture.** Each fix revealing new shared state or new symptoms elsewhere = wrong pattern. Question the foundations with the human before any fix #4 — fixes under a bad design don't converge.
- Fix spiraling larger than the bug? Same stop: your root-cause is wrong; go back to phase 2.
