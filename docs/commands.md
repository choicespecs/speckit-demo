# The Spec-Kit Commands

`specify init --integration claude` installed ten skills under `.claude/skills/`. This
demo only exercised five of them — the core pipeline. The other five are real, installed,
and available in this repo right now; they're documented here so you know what they do
even though we didn't need them for a four-endpoint API.

## Core pipeline (used in this repo)

### `/speckit-constitution`

**Reads**: existing `constitution.md` (if any), conversation input
**Writes**: `.specify/memory/constitution.md`

Establishes the project's non-negotiable rules before anything else exists. Every other
command reads this file. Re-running it later *amends* the constitution — it bumps
`CONSTITUTION_VERSION` per semantic versioning (MAJOR for removing/redefining a principle,
MINOR for adding one, PATCH for wording) and records the change in a Sync Impact Report.
See `PROCESS.md` §3 and [`constitution.md`](../.specify/memory/constitution.md).

### `/speckit-specify`

**Reads**: `constitution.md`
**Writes**: `specs/<NNN-feature>/spec.md`, `specs/<NNN-feature>/checklists/requirements.md`

Turns a feature description into user stories, functional requirements, and success
criteria — deliberately *before* any tech-stack decision. Validates its own output
against a quality checklist and will pause to ask up to 3 `[NEEDS CLARIFICATION]`
questions if the description leaves something genuinely ambiguous. Our run needed zero,
because the constitution had already pinned scope. See
[`spec.md`](../specs/001-task-list-api/spec.md).

### `/speckit-plan`

**Reads**: `spec.md`, `constitution.md`
**Writes**: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

Turns the *what* into the *how*: tech stack, architecture, and a Constitution Check gate
that re-verifies every principle before and after design. This is the only command with
an explicit pass/fail gate baked into its output. See
[`plan.md`](../specs/001-task-list-api/plan.md).

### `/speckit-tasks`

**Reads**: `plan.md`, `spec.md`, and whichever of `data-model.md` / `contracts/` /
`research.md` exist
**Writes**: `tasks.md`

Breaks the plan into a dependency-ordered, checkbox-format task list, grouped by user
story so each story is independently shippable. See
[`tasks.md`](../specs/001-task-list-api/tasks.md).

### `/speckit-implement`

**Reads**: `tasks.md` and everything upstream
**Writes**: the actual code; flips `- [ ]` to `- [X]` in `tasks.md` as it completes each task

Checks that any quality checklists are fully passed first (it will stop and ask before
implementing against an incomplete spec), then works through `tasks.md` phase by phase,
validating each user story against `quickstart.md` before moving to the next.

## Enhancement commands (installed, not used in this demo)

### `/speckit-clarify`

**When**: before `/speckit-plan`, if a spec still has ambiguity worth resolving
**What it does**: asks up to 5 targeted clarification questions and encodes the answers
directly back into `spec.md`. We didn't need this — our spec had zero
`[NEEDS CLARIFICATION]` markers on the first draft, because the constitution's Demo Scope
Constraints already answered the questions this command exists to ask.

### `/speckit-analyze`

**When**: after `/speckit-tasks`, before `/speckit-implement`
**What it does**: a non-destructive cross-artifact consistency check — does `tasks.md`
actually cover every requirement in `spec.md`? Does `plan.md` contradict the constitution
anywhere? Worth running on any feature bigger than this demo's, where drift between
documents becomes plausible.

### `/speckit-checklist`

**When**: any time, generated on demand
**What it does**: creates a *custom* checklist beyond the automatic spec-quality one —
e.g. a security checklist, a UX checklist, or a domain-specific compliance checklist —
using the same `checklist-template.md` structure described in `markdown-templates.md`.
The `requirements.md` checklist `/speckit-specify` generates automatically is actually a
built-in special case of what this command lets you do generally.

### `/speckit-converge`

**What it does**: compares the current codebase against `spec.md` / `plan.md` / `tasks.md`
and appends any work it finds missing as new tasks. Useful when code has drifted ahead of
(or fallen behind) its own spec — e.g. someone hand-patched a bug without updating
`tasks.md`, and you want the task list to catch back up to reality.

### `/speckit-taskstoissues`

**What it does**: converts `tasks.md` entries into GitHub issues, preserving dependency
order. Useful once a feature is real enough to need per-task tracking/assignment instead
of a single checklist file.

## Quick reference

| Command | Core? | Reads | Writes |
|---|---|---|---|
| `/speckit-constitution` | ✅ | — | `constitution.md` |
| `/speckit-specify` | ✅ | constitution.md | `spec.md`, `checklists/requirements.md` |
| `/speckit-clarify` | optional | spec.md | updates `spec.md` in place |
| `/speckit-plan` | ✅ | spec.md, constitution.md | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| `/speckit-tasks` | ✅ | plan.md + Phase 1 outputs | `tasks.md` |
| `/speckit-checklist` | optional | any artifact | a new custom checklist file |
| `/speckit-analyze` | optional | spec/plan/tasks | a consistency report (no files written) |
| `/speckit-implement` | ✅ | tasks.md + everything above | code, `tasks.md` checked off |
| `/speckit-converge` | optional | codebase + all artifacts | appends tasks to `tasks.md` |
| `/speckit-taskstoissues` | optional | tasks.md | GitHub issues |
