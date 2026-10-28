---
name: writing-skills
description: "Use when creating a new agentflow skill or editing an existing one: skills are TDD for documentation — baseline-test the failure before writing the rule."
---

# Writing Skills

Writing a skill IS test-driven development applied to process documentation.

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

## The Cycle

1. **RED (baseline):** Run a pressure scenario with a fresh agent WITHOUT your skill. Document verbatim what it does wrong and which rationalizations it says. A failure you didn't observe is a failure you can't target.
2. **GREEN:** Write the minimal skill that counters those specific failures and rationalizations. Nothing for hypothetical cases. Re-run the scenario; it should now comply.
3. **REFACTOR:** New rationalization appears? Add its explicit counter. Repeat until it holds under combined pressure (time + sunk cost + "just this once").

## Form Matches the Failure

| Baseline failure | Right form | Wrong form |
|---|---|---|
| Knows the rule, violates it under pressure | Iron rule + rationalization table + red flags | Soft "prefer/consider" guidance |
| Output has the wrong shape | Positive recipe: state what the output IS, its parts, in order | A list of prohibitions |
| Omits a required element | REQUIRED slot in the template they fill | Prose reminders nearby |
| Behavior should depend on a condition | Conditional keyed to an observable predicate | Unconditional rule + exemption clauses |

Rules for whichever form: **no nuance clauses** ("don't X unless…" reopens the negotiation — express real exceptions as their own conditional); **exemption clauses don't scope** — restructure if a rule must not reach part of the output.

## SKILL.md Quality Bar

- Frontmatter: `name` (letters/numbers/hyphens) + `description` starting "Use when…" — trigger conditions and symptoms ONLY, never a workflow summary (agents follow the summary instead of reading the skill)
- Core principle stated once, near the top, in a code fence if it's an iron law
- One excellent example beats several mediocre ones; no multi-language dilution
- Steps are ACTIONS with checkable results — "write failing test, run it, read the output"
- No narrative ("in that session we found…"), no generic labels (helper1, step3)
- Runs under the same build validator: `npm test` must pass

## Don't Create

- One-off solutions; well-documented standard practice; project conventions (those live in `.agentflow/conventions.md`); things enforceable with regex/CI (automate, don't document)
