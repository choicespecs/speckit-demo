# The Spec-Kit Lifecycle: What Runs Once vs. What Repeats

The other docs in this directory explain what each command does and how the template
system works. None of them answer a more basic question: **once you've set this up, what
does day-to-day usage actually look like?** Do you run the whole pipeline every time you
touch the code, or is most of it a one-time setup? This doc answers that.

The short version: setup is a one-time cost, the constitution is rarely touched, and one
specific chain of commands is the actual repeatable engine you run **every time you build
something new** — for the life of the project.

## Tier 1 — Once per repository, ever

**`specify init`**

Scaffolds `.specify/` and the agent-specific skill files (see `cli-init.md`). You don't
re-run this for new features. The only reasons to touch it again:

- Adding a second coding-agent integration to the same repo (`specify init --integration
  copilot`, say, alongside the existing `claude` one)
- Pulling in improvements to the bundled templates/scripts via `specify self upgrade`
  after spec-kit itself releases a new version

## Tier 2 — Rare, deliberate amendments

**`/speckit-constitution`**

Run once, early, to establish the project's non-negotiable rules — this repo's
[`constitution.md`](../.specify/memory/constitution.md) was written before any feature
existed. After that, you re-run it only when the **rules themselves** need to change, not
when a feature needs building. That's why every run produces a Sync Impact Report and a
semantic version bump (MAJOR for removing/redefining a principle, MINOR for adding one,
PATCH for wording) — it's designed to feel like amending a real governing document, which
should be infrequent and deliberate, not a routine step in building feature #47.

**"Rare" doesn't mean "frozen," though — here's how an amendment actually happens.** You
don't hand-edit `constitution.md` directly; you re-invoke `/speckit-constitution`,
describing the change, and the same skill that wrote v1.0.0 handles the amendment:

1. It loads the existing constitution and works out what's changing vs. what stays.
2. It **decides the version bump itself**, by rule — MAJOR if a principle is being
   removed or redefined, MINOR if one is being added, PATCH for wording-only changes.
   You don't pick the number; the nature of the change determines it.
3. `Last Amended` updates to today; `Ratified` (the original adoption date) never changes.
4. It re-reads `plan-template.md`, `spec-template.md`, `tasks-template.md`, and every
   installed command file for now-stale references to what just changed.
5. It prepends a **new** Sync Impact Report recording old version → new version and
   exactly what changed — the same HTML-comment block currently showing `[none] → 1.0.0`
   at the top of ours would show `1.0.0 → 1.1.0` (or `2.0.0`) after an amendment.

**A concrete example for this repo**: imagine a second feature needed to persist tasks to
disk. That directly violates "Illustrative, Not Production" (no persistence layer) and
"Minimal Dependencies" (`express` only). `/speckit-plan`'s Constitution Check gate would
fail it outright — you couldn't `/speckit-specify` your way around a gate. The correct
order is: run `/speckit-constitution` first, explicitly redefine or scope the relevant
principle (a MAJOR bump, since you're redefining one), *then* `/speckit-specify` the new
feature against the updated rules. The gate failing isn't a bug to route around — it's the
constitution doing exactly its job: forcing a scope-widening decision to be explicit and
version-tracked instead of silently drifting in through one feature's plan.

**What doesn't happen automatically**: an amendment doesn't retroactively touch
`specs/001-task-list-api/` — that feature stays a historical record of what the rules were
under v1.0.0, the version in effect when it was built. Nothing re-validates old features
against a new constitution version on its own; that's what `/speckit-analyze` (a
read-only consistency check) or `/speckit-converge` (which appends remediation tasks) are
for if you want to check a specific feature for drift after a constitution change.

## Tier 3 — The repeatable engine: once per feature

This is the part that actually loops, for as long as the project exists:

```text
/speckit-specify  →  [/speckit-clarify]  →  /speckit-plan  →  [/speckit-checklist]
     →  /speckit-tasks  →  [/speckit-analyze]  →  /speckit-implement
```
(commands in brackets are optional enhancement steps — see `commands.md`)

Every pass through this chain is triggered by wanting to build **one new feature or
increment**, and produces its own directory: `specs/<NNN>-<feature-name>/`. This repo has
exactly one, [`specs/001-task-list-api/`](../specs/001-task-list-api/), because a minimal
demo only needs one lap to make its point — but the numbering scheme is built for many.
Recall `.specify/init-options.json`:

```json
{ "feature_numbering": "sequential", ... }
```

That setting exists *because* this is meant to repeat. Feature two in this repo would be
`specs/002-<whatever-comes-next>/`, feature three `specs/003-.../`, and so on — every one
of them reading the *same* `constitution.md` from Tier 2, the way every feature branch in
a normal git workflow reads off the same `main`.

**What doesn't change between laps**: the constitution. **What's new every lap**: the
entire `specs/<NNN>-.../` directory and whatever code `/speckit-implement` produces for
that specific feature.

**A concrete before/after**, if this repo built a second feature (say, adding due dates to
tasks):

```text
.specify/memory/constitution.md          # untouched — still v1.0.0, still governs both features
specs/
├── 001-task-list-api/                   # this repo's actual feature
│   ├── spec.md, plan.md, tasks.md, ...
└── 002-task-due-dates/                  # a hypothetical second lap through Tier 3
    ├── spec.md, plan.md, tasks.md, ...
spec-driven/src/                          # gains whatever 002's tasks.md says to add
```

The constitution doesn't get touched unless feature two's requirements genuinely conflict
with a standing principle — e.g. if it needed a database, that would force a Tier 2
amendment to "Minimal Dependencies" first, which is exactly the kind of friction the
constitution is supposed to create on purpose.

## Tier 4 — Ongoing, as-needed maintenance

These don't fit a fixed cadence — you reach for them when a specific situation arises:

- **`/speckit-converge`** — code and spec have drifted (someone hand-patched a bug, or a
  requirement quietly changed) and you want `tasks.md` to catch back up to reality. Run
  it whenever you suspect drift, not on a schedule.
- **`/speckit-taskstoissues`** — a feature's `tasks.md` is stable enough to become
  tracked, assignable GitHub issues. Typically once per feature, once it's real enough to
  need per-task ownership.
- **`specify extension add/update`** — install or refresh an extension (see
  `extensions.md`) — infrequent, deliberate, like adding a new dev dependency.

## Decision guide

| Situation | Command |
|---|---|
| Starting the project from scratch | `specify init`, then `/speckit-constitution` |
| Starting a brand-new feature | `/speckit-specify` (Tier 3, lap 1) |
| The spec I just wrote has real ambiguity | `/speckit-clarify` |
| Ready to decide the tech/architecture for this feature | `/speckit-plan` |
| Want a custom quality gate beyond the standard one | `/speckit-checklist` |
| Ready to break the plan into buildable pieces | `/speckit-tasks` |
| Want a consistency check before writing code | `/speckit-analyze` |
| Ready to actually build it | `/speckit-implement` |
| Code and spec don't agree anymore | `/speckit-converge` |
| Feature needs per-task tracking now | `/speckit-taskstoissues` |
| A project-wide *rule* needs to change | `/speckit-constitution` (Tier 2 — rare) |
| spec-kit itself released template/CLI improvements | `specify self upgrade` (Tier 1 — rare) |

## In this repo, specifically

`speckit-demo` intentionally stopped after one Tier 3 lap — building a second feature
would add real value to a production project, but would dilute this repo's actual job,
which is showing the *mechanics* of one lap clearly rather than showing repetition. If you
fork this repo to build something real, Tier 3 is the part you'll be running over and
over; Tiers 1 and 2 are what you already did once, on day one, by working through this
demo's own `PROCESS.md`.
