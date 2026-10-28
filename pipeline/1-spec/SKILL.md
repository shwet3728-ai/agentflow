---
name: spec
description: "Stage 1. Use before any creative work: new features, new projects, behavior changes. Draws out what the human actually wants and gets it signed, before anything is built."
---

# Stage 1 — Spec

You build well but you build what you *believe* was asked. That belief is usually thinner than it feels. This stage finds out what they actually want, then gets it signed.

## Gate

```
NOTHING IS BUILT before the spec is approved and ledgered.
Built = product code, scaffolds, dependency installs, project creation.
Allowed = reading, exploring, discussing. Spikes, only with explicit yes, stay labeled throwaway.
```

## Do

1. **Look first.** Read the code/context they pointed at. Never ask what the repo already answers.
2. **One question at a time** (analyst role). Lead with what they *want to get*, not the solution. Each question is specific, says why it changes what you build ("if voting closes at 5, does someone joining at 4:59 get to vote?").
3. **Play back in chunks.** 200-300 words: what it's for, who it serves, what it does. End: "wrong or missing?" Only their words are *theirs*; anything you filled in is labeled your proposal with your reason.
4. **Approaches.** 2-3 real ways to build it, what each trades off, your pick + why. Drop weak ones yourself. In a message of its own.
5. **Size it.** Small change = short spec (what you covered, written down). Project = full design: intent/why, goals, non-goals, **anti-goals**, constraints, chosen approach, decisions they made, what's left to the builder.
6. **Write it:** `docs/agentflow/specs/YYYY-MM-DD-<topic>.md`, committed.
7. **Builder check** (projects): dispatch a fresh subagent: "could you plan from this spec alone?" Their questions = 3 piles: already-answered (fix the spec), trivial (answer, mark as your call), hers/his (ask the human, ONE round, most important first).

## Gate Exit

Say "Spec ready at <path>. Approve to continue?" — approval is about the *document*. "Sounds good" to the idea is NOT approval. On approval: ledger `Spec: approved <path>` and load stage 2-plan.

## Skip

They said "no questions, just build": one line stating the how-it-gets-made call you made for them, then build it. Ledger that call as a ruling.
