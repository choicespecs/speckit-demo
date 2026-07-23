# The Spec-Kit Process: Commands, Files, and Markdown Conventions

`README.md` makes the case for *why* spec-driven development matters, using this repo's
before/after contrast. This document is the companion piece: a step-by-step walkthrough
of *how* each artifact in [`specs/001-task-list-api/`](./specs/001-task-list-api/) and
[`.specify/memory/constitution.md`](./.specify/memory/constitution.md) actually got made —
which command produced it, what template it started from, and the markdown conventions
spec-kit uses throughout so you can write consistent files of your own.

For a deeper reference on spec-kit's own mechanics beyond this project's specific
walkthrough — every `specify init` flag, every installed command (including the ones this
demo didn't need), and how the two-layer template system is generated and customized —
see [`docs/`](./docs/).

## 1. Installing spec-kit

Everything starts with one CLI command, run once against this repo:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --integration claude
```

This scaffolds two things and nothing else — it does **not** write any spec content itself:

```text
.specify/
├── memory/constitution.md       # copied from constitution-template.md, still full of placeholders
├── templates/                   # spec/plan/tasks/checklist templates, unfilled
├── scripts/bash/                # helper scripts the commands below call
└── workflows/                   # workflow registry

.claude/skills/speckit-*/SKILL.md  # one command definition per spec-kit command
```

Each `SKILL.md` is a **playbook**, not a generator: it's a set of instructions that get
loaded into an AI agent's context when you run `/speckit-constitution`,
`/speckit-specify`, etc. The agent then follows those instructions to write the actual
content. That's the mechanism behind every step below.

## 2. Anatomy of a spec-kit markdown file

Before walking through each command, it helps to know the conventions every generated
file in this repo follows — reuse these if you write your own.

**Placeholder tokens.** Templates use `[ALL_CAPS_BRACKETS]` for anything to be filled in.
`.specify/templates/constitution-template.md` starts with `[PROJECT_NAME]`,
`[PRINCIPLE_1_NAME]`, `[PRINCIPLE_1_DESCRIPTION]`, etc. Filling a template means replacing
every bracket token with concrete text — none should survive into the final file.

**Stable heading hierarchy.** Templates are never restructured — only their content
changes. Compare `.specify/templates/plan-template.md`'s headings to our
[`plan.md`](./specs/001-task-list-api/plan.md): `## Technical Context`,
`## Constitution Check`, `## Project Structure` appear in both, in the same order.

**Fixed slots vs. free-form slots.** Not every placeholder in a template means the same
thing. The constitution template has two different kinds:

- **Numbered principle slots** (`[PRINCIPLE_1_NAME]` … `[PRINCIPLE_5_NAME]`) are for
  *behavioral rules* — timeless "MUST" statements meant to shape every decision
  downstream. You can have fewer or more than five; the number is a default, not a limit.
- **Free-form section slots** (`[SECTION_2_NAME]`, `[SECTION_3_NAME]`) are for governance
  that doesn't fit the "MUST" shape but still needs to be nailed down once and referenced
  everywhere — usually either domain constraints or structural facts. The template's own
  comments list examples: *Additional Constraints, Security Requirements, Performance
  Standards* for one, *Development Workflow, Review Process, Quality Gates* for the
  other. You name the section whatever fits your project — the bracket token is a slot,
  not a fixed label.

In [`constitution.md`](./.specify/memory/constitution.md) we named these two slots
**Demo Scope Constraints** (a fact about scope — "exactly these four operations" — not a
rule about *how* to build) and **Repository Layout** (structural — where `vibe-coded/`,
`spec-driven/`, and `README.md` live, not a MUST-statement). Other projects might instead
name theirs *Technology Stack Mandates*, *Security & Compliance Requirements*,
*Performance Standards*, or *Deployment Policies* — whatever non-principle governance that
project actually needs. Nothing caps you at exactly two, either — add a
`## Section 4: Whatever` if a project needs a third dimension.

These sections aren't decorative: every downstream command reads the *whole*
`constitution.md`, not just the numbered principles. Our **Demo Scope Constraints**
section is the reason `/speckit-specify` never let scope drift past four operations and
needed zero `[NEEDS CLARIFICATION]` markers — and our **Repository Layout** section is
why `plan.md`'s Project Structure put `spec-driven/` exactly where the constitution had
already declared it should go, rather than re-deciding it. By convention, `/speckit-plan`'s
Constitution Check gate only walks the *numbered* principles explicitly — but nothing
stops a project from also treating a custom section like "Security Requirements" as a
hard gate if that's what the team wants enforced.

**HTML comments for machine-readable metadata that isn't prose.** Our constitution opens
with a `<!-- Sync Impact Report -->` comment recording the version bump and rationale —
visible in source, invisible when rendered, so it doesn't clutter the read experience:

```html
<!--
Sync Impact Report
- Version change: [none] → 1.0.0 (initial ratification)
...
-->
```

**The checklist format for anything actionable.** Every task in
[`tasks.md`](./specs/001-task-list-api/tasks.md) follows one strict shape:

```text
- [ ] [TaskID] [P?] [Story?] Description with exact file path
```
e.g. `T006 [US1] Implement POST /tasks in spec-driven/src/routes/tasks.js`. The `[P]`
marker means "parallelizable," `[US1]` ties the task back to a user story. This format is
what let us flip each box to `[X]` as `/speckit-implement` worked through the list —
grep-able, checkable progress instead of prose.

**Traceable IDs everywhere.** Requirements are `FR-001`…`FR-008`, success criteria are
`SC-001`…`SC-004`, user stories are `US1`/`US2`/`US3`. The same IDs show up again in
`plan.md`'s Constitution Check, in `contracts/tasks-api.md`'s endpoint docs, and as code
comments in `spec-driven/src/routes/tasks.js` (e.g. `// FR-004, FR-007`). This is what
makes the constitution's "Traceability From Spec to Code" principle checkable rather than
aspirational.

**Tables for anything comparative or gate-like.** Constitution Check in `plan.md` lists
each principle with a PASS/FAIL verdict; the requirements checklist in
`checklists/requirements.md` does the same for spec quality. Markdown tables read faster
than prose when the point is "here's N things, each with a verdict."

## 3. Step by step: command → template → our file

### `/speckit-constitution`

**Reads**: `.specify/templates/constitution-template.md`
**Writes**: `.specify/memory/constitution.md`

The template has five generic principle slots and three free-form sections
(`[SECTION_2_NAME]`, `[SECTION_3_NAME]`, `Governance`). For this project those became:

| Template slot | Filled with |
|---|---|
| Principle I–V | Simplicity & Legibility, Illustrative Not Production, Fair Parity Between Implementations, Traceability From Spec to Code, Minimal Dependencies |
| `[SECTION_2_NAME]` | Demo Scope Constraints (the four-operations limit) |
| `[SECTION_3_NAME]` | Repository Layout (`vibe-coded/`, `spec-driven/`, `README.md`) |
| `[CONSTITUTION_VERSION]` | `1.0.0` — first ratification, so no prior version to bump from |

Every later command reads this file before writing anything, and checks its own output
against these principles — see the Constitution Check gate in step 3 below.

### `/speckit-specify`

**Reads**: `.specify/templates/spec-template.md`, `constitution.md`
**Writes**: `specs/001-task-list-api/spec.md`, `specs/001-task-list-api/checklists/requirements.md`

The template's core structure is **User Story → Priority → Independent Test → Acceptance
Scenarios**, repeated per story, plus `Requirements` and `Success Criteria` sections.
Feeding it the one-paragraph feature description ("add/mark-done/list/delete, in-memory,
illustrative") produced:

- 3 user stories, each with a `Given/When/Then` acceptance scenario and an explicit
  **Independent Test** — the thing that makes each story shippable on its own (see
  [`spec.md`](./specs/001-task-list-api/spec.md))
- 8 functional requirements (`FR-001`–`FR-008`), each phrased as "System MUST …" so it's
  testable, not just descriptive
- A `checklists/requirements.md` quality gate — this command doesn't just write the spec,
  it validates its own output against a checklist (no leaked implementation details, no
  unresolved ambiguity) before calling itself done

Because the constitution already pinned down scope (exactly four operations, in-memory,
no auth), zero `[NEEDS CLARIFICATION]` markers were needed — the checklist passed on the
first draft.

### `/speckit-plan`

**Reads**: `spec.md`, `constitution.md`, `.specify/templates/plan-template.md`
**Runs**: `.specify/scripts/bash/setup-plan.sh --json` (copies the template, returns file paths)
**Writes**: `plan.md`, then Phase 0's `research.md`, then Phase 1's `data-model.md`,
`contracts/tasks-api.md`, `quickstart.md`

This is the only command with a **gate**: the `## Constitution Check` section in
[`plan.md`](./specs/001-task-list-api/plan.md) re-states each of the five principles and
records PASS/FAIL before design work is allowed to proceed, then again after — this is
where "vanilla JS + Express only" and "state isolated in `store.js`" got locked in as
concrete decisions, not vibes.

Phase 0 (`research.md`) answers every open technical question as **Decision / Rationale /
Alternatives considered** — e.g. why an incrementing integer id beats a `uuid` dependency
for a four-endpoint demo. Phase 1 then turns those decisions into three artifacts:
`data-model.md` (the `Task` entity, field by field), `contracts/tasks-api.md` (request/
response shape per endpoint), and `quickstart.md` (a `curl` runbook — this project has no
test framework by constitutional rule, so this file is the verification method).

### `/speckit-tasks`

**Reads**: `plan.md`, `spec.md`, `data-model.md`, `contracts/`, `research.md`
**Runs**: `.specify/scripts/bash/setup-tasks.sh --json`
**Writes**: `tasks.md`

Tasks are grouped by phase — Setup, Foundational (blocking, shared by every story),
then one phase per user story in priority order, then Polish — using the checklist format
from section 2 above. Our [`tasks.md`](./specs/001-task-list-api/tasks.md) has 15 tasks
across 6 phases; because all three stories' routes live in one small
`routes/tasks.js` file (a deliberate simplicity choice), the tasks note explicitly that
stories must be built sequentially rather than in parallel — a real constraint the plan
surfaced, not an oversight.

### `/speckit-implement`

**Reads**: `tasks.md` and everything upstream of it
**Runs**: `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`
**Writes**: the actual code, and flips each `- [ ]` to `- [X]` in `tasks.md` as it goes

This command first checks that `checklists/requirements.md` is fully passed — it will stop
and ask before implementing against an unfinished spec. Then it works phase by phase:
foundational files first (`store.js`, the empty router, `server.js`), then one user
story at a time, validating each against `quickstart.md` before moving to the next. The
`[X]` marks in `tasks.md` right now are a literal record of that sequence — T001 through
T015, checked off in order, not written after the fact.

## 4. Writing your own spec-kit-style markdown

To extend this pattern to a new feature or a different repo:

1. Start from the matching template in `.specify/templates/` — don't write a spec/plan/
   tasks file freehand; the section order is what makes every feature's docs skimmable
   the same way.
2. Replace every `[BRACKET_TOKEN]`; if something is genuinely undecided, leave a
   `[NEEDS CLARIFICATION: specific question]` marker rather than guessing silently.
3. Give every requirement, success criterion, and user story a stable ID (`FR-`, `SC-`,
   `US`) the moment you write it — retrofitting traceability later is much harder than
   assigning IDs up front.
4. Use the `- [ ] [ID] [P?] [Story?] Description + file path` format for anything meant to
   become a checkable unit of work — vague prose tasks are what `/speckit-tasks` exists to
   prevent.
5. Put anything comparative (pass/fail, before/after, option A vs. B) in a table, not a
   paragraph — see the Constitution Check gate or the comparison table in `README.md`.
6. If you need a one-off validation checklist beyond the standard spec-quality one, that's
   what `.specify/templates/checklist-template.md` and the `/speckit-checklist` command
   are for.

## Quick reference

| Command | Reads | Writes |
|---|---|---|
| `/speckit-constitution` | (nothing upstream) | `.specify/memory/constitution.md` |
| `/speckit-specify` | constitution.md | `specs/<feature>/spec.md`, `checklists/requirements.md` |
| `/speckit-plan` | spec.md, constitution.md | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| `/speckit-tasks` | plan.md + Phase 1 outputs | `tasks.md` |
| `/speckit-implement` | tasks.md + everything above | working code, `tasks.md` checked off |
