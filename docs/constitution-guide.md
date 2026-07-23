# The Constitution: Configuration, Arguments, and Sample Commands

This is the focused reference the other docs point at but don't fully spell out: how do
you actually *configure* `/speckit-constitution`, what goes in its arguments, and what do
real invocations look like? `lifecycle.md` covers *when* to run it (rarely, deliberately);
`markdown-templates.md` covers the section-slot mechanics; this doc is the "what do I
actually type" reference, with samples for every scenario.

## How you invoke it

```
/speckit-constitution <free-text description of your principles/values/constraints>
```

Its `argument-hint` (from `.claude/skills/speckit-constitution/SKILL.md`'s frontmatter) is
literally: *"Principles or values for the project constitution."* That's the whole
interface — **there are no flags, no key-value pairs, no structured syntax**. You describe
what you want governed, in plain prose, and the command does the structuring for you. You
do not need to pre-organize your input into "Principle 1, Principle 2, ..." — that's the
command's job, not yours.

One more thing that sets it apart from every other command: it's the only one of the ten
with **no prerequisite shell script**. `/speckit-specify` runs `create-new-feature.sh`,
`/speckit-plan` runs `setup-plan.sh`, `/speckit-tasks` runs `setup-tasks.sh`,
`/speckit-implement`/`/speckit-clarify`/`/speckit-analyze`/`/speckit-checklist`/
`/speckit-converge`/`/speckit-taskstoissues` all run `check-prerequisites.sh` first.
`/speckit-constitution` doesn't — it operates directly on
`.specify/memory/constitution.md`, because there's nothing upstream of it to look up. It's
the one command that has no dependency on anything else in `.specify/specs/`.

## What "configuring" it actually means

Feeding it a paragraph of prose triggers a fixed process, not a freeform rewrite:

1. **Classify your input.** Anything that reads as a feature request, code change, or
   implementation detail gets pulled out and deferred to a `Next Actions` list pointing at
   the right follow-up command — it is never executed here (see the "what not to put in
   arguments" section below).
2. **Fill the five principle slots** with genuine behavioral rules extracted from your
   prose, and **name and fill the two free-form section slots** — it picks names like
   *Demo Scope Constraints* or *Security Requirements* based on what you actually
   described, not from a fixed list you choose from (see `markdown-templates.md` for the
   fixed-vs-free-form distinction in depth).
3. **Decide the version bump itself** — MAJOR/MINOR/PATCH — by rule, based on whether
   you're removing/redefining a principle, adding one, or just clarifying wording. You
   never specify the version number.
4. **Propagate the change** — re-reads `plan-template.md`, `spec-template.md`,
   `tasks-template.md`, and every installed command file for now-stale references.
5. **Write a Sync Impact Report** — an HTML comment at the top of the file recording old
   version → new version and exactly what changed.

## Sample commands, by scenario

| Scenario | Sample argument text | Resulting bump |
|---|---|---|
| First-time creation | *(see full example below)* | initial `1.0.0` |
| Adding a new principle | `Add a principle: every new API endpoint must have its request/response contract documented in contracts/ before /speckit-implement runs against it.` | MINOR |
| Redefining/loosening a principle | `We're adding a feature that needs to persist tasks across restarts, so amend Minimal Dependencies to allow one lightweight embedded database (e.g. SQLite via a single well-known driver) in addition to express, instead of express only.` | MAJOR |
| Wording clarification only | `Clarify Minimal Dependencies to explicitly state that devDependencies used only for local tooling, never shipped, don't count against the principle.` | PATCH |

## What this repo's actual constitution would look like as one invocation

This repo's real [`constitution.md`](../.specify/memory/constitution.md) was written by
directly following this same process by hand — mid-session, `/speckit-constitution`
wasn't registered yet as a skill (see `PROCESS.md` for that detail) — rather than through
one literal typed command. But its content is exactly what this single invocation would
produce if run today:

```
/speckit-constitution This is a demo repo showing how to use spec-kit, contrasting a
vibe-coded implementation against a spec-driven one for the same tiny feature. Principles:
(1) every artifact — constitution, spec, plan, tasks, code — must be readable in one pass
by someone who's never seen spec-kit before; (2) this code is illustrative only, never
production — in-memory state, no auth, no persistence, no deployment tooling; (3) the
vibe-coded and spec-driven implementations must solve identical scope so the comparison is
fair, never artificially weakened on either side; (4) every implementation decision in the
spec-driven side must trace back to a line in spec.md, plan.md, or tasks.md; (5) use
vanilla JavaScript and Express only, no other runtime dependency, no test framework, no
build step. Also define: the example feature is a task list API with exactly four
operations (add, mark done, list, delete) and state resets on restart — scope must not
grow beyond this without amending the constitution first. And document the repository
layout: vibe-coded/ (the one-shot build), spec-driven/ (the spec-kit build plus its own
.specify/specs/ folder), and a root README.md tying both together.
```

Notice this is one unstructured paragraph — the command is what turned it into five
numbered principles plus two named sections (**Demo Scope Constraints**, **Repository
Layout**) and a Governance block, not a form you fill in section by section yourself.

## What NOT to put in the arguments

The command's own "Scope Guard" explicitly refuses to act on non-governance intent mixed
into your input. If you typed:

```
/speckit-constitution Add a principle that all API errors return JSON, and also go ahead
and add error handling to the existing /tasks/:id/done route right now.
```

it would update the constitution with the new principle, then respond with something like:

```markdown
## Next Actions

- Deferred: "add error handling to /tasks/:id/done" — this is an implementation change,
  not a governance update. Suggested follow-up: `/speckit-plan` (if this changes the
  technical approach) or implement it directly against the now-updated principle.
```

It will never write application code, routes, or tests from inside this command — that
boundary is deliberate, not an oversight.

## Argument reference across all ten commands

Since arguments differ meaningfully by command — some expect a full description, most are
optional guidance, one takes no argument at all — here's the complete picture, pulled
directly from each `SKILL.md`'s `argument-hint`:

| Command | `argument-hint` | Effectively required? |
|---|---|---|
| `/speckit-constitution` | Principles or values for the project constitution | Yes, for a first run — empty is fine for an amendment discussion |
| `/speckit-specify` | Describe the feature you want to specify | Yes — this *is* the feature description |
| `/speckit-clarify` | Optional areas to clarify in the spec | No — works from the existing spec alone |
| `/speckit-plan` | Optional guidance for the planning phase | No — pulls from `spec.md`/`constitution.md` |
| `/speckit-checklist` | Domain or focus area for the checklist | Effectively yes — otherwise it doesn't know what domain to check |
| `/speckit-tasks` | Optional task generation constraints | No — pulls from `plan.md` and Phase 1 outputs |
| `/speckit-analyze` | Optional focus areas for analysis | No — scans all of spec/plan/tasks by default |
| `/speckit-implement` | Optional implementation guidance or task filter | No — works through all of `tasks.md` by default |
| `/speckit-converge` | *(none — no argument-hint defined)* | No — always assesses the full feature scope |
| `/speckit-taskstoissues` | Optional filter or label for GitHub issues | No — converts all of `tasks.md` by default |

The pattern: only the two commands that *originate* new content from scratch
(`/speckit-constitution`, `/speckit-specify`) genuinely need substantial prose input.
Everything downstream of them is designed to work with zero arguments, pulling context
from the artifacts already on disk — arguments to those commands are for *steering*
(narrow the focus, add a constraint), never *required* input.
