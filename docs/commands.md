# The Spec-Kit Commands

`specify init --integration claude` installed ten skills under `.claude/skills/`. This
demo only ran five of them — the core pipeline. The other five are real, installed, and
available in this repo right now. Every explanation below is grounded in the actual
instructions inside each command's `SKILL.md`, not a paraphrase of spec-kit's external
docs — so you know not just *what* each command produces, but *how* it decides what to
produce.

## Core pipeline (used in this repo)

### `/speckit-constitution`

**Reads**: existing `constitution.md` (if any), your input
**Writes**: `.specify/memory/constitution.md`

**How it actually works**: it treats `constitution-template.md`'s `[BRACKET]` tokens as
things to fill, then runs a strict process, not a free-form rewrite. It classifies every
part of your input as either constitution content or a separate intent (feature requests,
code changes) — non-governance intents get deferred to a "Next Actions" list pointing at
the right follow-up command, never executed here. It decides the semantic version bump
itself (MAJOR/MINOR/PATCH, by rule, not by asking you), then **propagates** the change: it
re-reads `plan-template.md`, `spec-template.md`, `tasks-template.md`, and every installed
command file to check whether anything now references an outdated principle. Finally it
prepends a Sync Impact Report (an HTML comment) recording old version → new version and
exactly what changed. This same process handles *amendments*, not just the first write —
see `lifecycle.md` §Tier 2 for how and when to actually re-run it.

### `/speckit-specify`

**Reads**: `constitution.md`
**Writes**: `specs/<NNN-feature>/spec.md`, `specs/<NNN-feature>/checklists/requirements.md`

**How it actually works**: first it derives a short 2-4 word slug from your description
(that's where `001-task-list-api` came from) and creates the numbered feature directory —
sequential or timestamp-based per `.specify/init-options.json`. Then it works through a
fixed extraction flow: parse actors/actions/data/constraints from your description, and
for anything genuinely ambiguous, it's allowed **at most 3** `[NEEDS CLARIFICATION]`
markers, prioritized scope > security/privacy > UX > technical detail — anything below
that bar gets a reasonable default instead, recorded in the spec's Assumptions section.
Every functional requirement must be phrased as testable ("System MUST..."), and every
success criterion must be technology-agnostic (no framework/API names allowed). After
writing the draft, it **validates its own output** against a generated quality checklist
and will iterate up to 3 times to fix failures before reporting done — which is why our
`spec.md` needed zero clarifying questions: the constitution's Demo Scope Constraints had
already answered everything the extraction flow would otherwise have had to ask about.

### `/speckit-plan`

**Reads**: `spec.md`, `constitution.md`
**Writes**: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**How it actually works**: runs `setup-plan.sh` to copy the plan template and resolve
paths, fills the Technical Context section (marking any real unknown as `NEEDS
CLARIFICATION` rather than guessing), then evaluates the **Constitution Check gate** —
every principle gets an explicit PASS/FAIL before design is allowed to proceed at all, and
again after. Phase 0 turns each unresolved technical question into a research task and
records the outcome as **Decision / Rationale / Alternatives considered** in
`research.md` — this is where "vanilla JS + Express, not Fastify or raw `http`" got
decided and justified, not just asserted. Phase 1 then derives `data-model.md` (entities
from the spec), `contracts/` (the actual request/response shape per interface, skipped
entirely for projects with no external interface), and `quickstart.md` (runnable
validation steps — the substitute for automated tests when a project's constitution
excludes a test framework, as ours does).

### `/speckit-tasks`

**Reads**: `plan.md`, `spec.md`, and whichever of `data-model.md` / `contracts/` /
`research.md` exist
**Writes**: `tasks.md`

**How it actually works**: organizes tasks **by user story first**, phase second — Setup,
then Foundational (blocking prerequisites shared by every story), then one phase per user
story in priority order, then Polish. Every task line has to match one exact format,
`- [ ] [TaskID] [P?] [Story?] Description with file path` — the `[P]` marker means
genuinely parallelizable (different files, no unmet dependency), and this command will
refuse to mark two tasks `[P]` if they touch the same file, which is exactly why our
`tasks.md` explicitly notes that US1/US2/US3 had to be sequential: all four routes live in
one `routes/tasks.js` file. It also builds a dependency graph and, separately, an
Implementation Strategy section describing the MVP-first path (stop after the first user
story, validate, ship) versus incremental delivery of every story.

### `/speckit-implement`

**Reads**: `tasks.md` and everything upstream
**Writes**: the actual code; flips `- [ ]` to `- [X]` in `tasks.md` as it completes each task

**How it actually works**: runs `check-prerequisites.sh` first and, if any quality
checklist under `checklists/` has incomplete items, **stops and asks** whether to proceed
anyway rather than silently implementing against an unfinished spec. Then it works
strictly phase-by-phase — sequential tasks in order, `[P]`-marked tasks together, tasks
touching the same file never in parallel regardless of markers — validating each user
story's checkpoint against `quickstart.md` before starting the next phase. If a
non-parallel task fails, execution halts with context for debugging rather than skipping
ahead; parallel tasks that fail are reported individually while the rest continue.

## Enhancement commands (installed, not used in this demo)

### `/speckit-clarify`

**When**: before `/speckit-plan`, if a spec still has ambiguity worth resolving

**How it actually works**: scans the spec against a fixed taxonomy — Functional Scope,
Domain & Data Model, Interaction & UX Flow, Non-Functional Quality, Integration &
External Dependencies, Edge Cases, Constraints & Tradeoffs, Terminology, Completion
Signals — marking each category Clear / Partial / Missing, then builds a prioritized
queue of **at most 5** questions total. It asks them **one at a time**, never revealing
what's queued next, and for each one it states its own recommended answer first (a
ranked-option table for multiple choice, or a suggested short answer) so you can just say
"yes" instead of composing an answer from scratch. The moment you accept an answer, it's
integrated into the correct spec section immediately and the file is saved — not batched
until the end — under a new `## Clarifications / ### Session <date>` heading, then the
spec-quality checklist is re-run and reported as a before/after pass count. We didn't need
this because `/speckit-specify` reported zero `[NEEDS CLARIFICATION]` markers on the first
draft.

### `/speckit-analyze`

**When**: after `/speckit-tasks`, before `/speckit-implement`

**How it actually works**: **strictly read-only** — it is explicitly forbidden from
modifying any file; it only ever prints a report. It builds an internal requirements
inventory keyed by `FR-###`/`SC-###`, a task-coverage map, and the constitution's MUST/
SHOULD rules, then runs six detection passes: duplication, ambiguity (vague adjectives
like "fast" or "robust" with no metric, unresolved `TODO`s), underspecification,
constitution alignment, coverage gaps (a requirement with zero tasks, or a task mapped to
nothing), and cross-file inconsistency (terminology drift, contradicting requirements).
Every finding gets a severity — **constitution violations are always CRITICAL**, by rule,
never negotiable within this command. It ends by asking whether you want remediation
suggestions, but will not apply them itself; that's a separate, explicit follow-up. Worth
running on any feature large enough that `spec.md`, `plan.md`, and `tasks.md` could
plausibly have drifted from each other — overkill for this demo's one small feature, but
this is exactly the gap-detection step a bigger project shouldn't skip.

### `/speckit-checklist`

**When**: any time, generated on demand

**How it actually works**: built on one deliberately narrow idea — a checklist item tests
the *quality of the requirements writing*, never the implementation. "Verify the button
clicks correctly" is explicitly banned; "Is 'prominent display' quantified with specific
sizing?" is the intended shape. It asks up to 3 dynamically-generated clarifying questions
about scope/depth/audience (derived from your request plus signals already in
spec/plan/tasks — never a generic pre-baked list), then generates items grouped by quality
dimension (Completeness, Clarity, Consistency, Measurability, Coverage, Non-Functional,
Dependencies & Assumptions) with a traceability tag on at least 80% of them (`[Spec §X.Y]`,
or `[Gap]` / `[Ambiguity]` / `[Conflict]` / `[Assumption]` when nothing exists to cite).
It writes to `checklists/<domain>.md` — `security.md`, `ux.md`, `api.md`, whatever fits —
and if that file already exists, it **appends**, continuing the `CHK###` numbering rather
than overwriting. The `requirements.md` checklist `/speckit-specify` generates
automatically is a built-in special case of exactly this same mechanism.

### `/speckit-converge`

**When**: after `/speckit-implement` has run, whenever code and spec might have drifted

**How it actually works**: explicitly **not** a git diff tool — it has no concept of
history, only "does the code right now satisfy the spec/plan/tasks right now." It
classifies every gap it finds as `missing` (absent entirely), `partial` (exists but
incomplete), `contradicts` (violates stated intent or a constitution MUST — always the
top-severity case), or `unrequested` (code doing something nobody asked for — flagged for
you to review or remove, never auto-deleted). Its only write is **append-only**: a single
new `## Phase N: Convergence` section at the bottom of `tasks.md`, with fresh task IDs
continuing from the highest existing one. It will never rewrite, renumber, or delete an
existing task, never touch `spec.md` or `plan.md`, and never touch application code
itself — that's still `/speckit-implement`'s job on the newly appended tasks. If nothing
is missing, `tasks.md` is left **byte-for-byte unchanged** and it reports "✅ Converged"
rather than writing an empty section just to prove it ran.

### `/speckit-taskstoissues`

**When**: once a feature's tasks are stable enough to need per-task tracking

**How it actually works**: hard-stops unless `git config --get remote.origin.url` is
actually a GitHub URL — there's an explicit, capitalized warning in its instructions never
to create issues in a repository that doesn't match the detected remote. Before creating
anything, it fetches existing issues via the GitHub MCP server and matches titles against
the `T\d{3}` task-ID pattern to avoid duplicates, so re-running it after `tasks.md`
changes won't recreate issues for tasks already tracked. Each new issue's title is the
canonical `T001: <description>` form, one per not-yet-covered task.

## Quick reference

| Command | Core? | Reads | Writes |
|---|---|---|---|
| `/speckit-constitution` | ✅ | — | `constitution.md` |
| `/speckit-specify` | ✅ | constitution.md | `spec.md`, `checklists/requirements.md` |
| `/speckit-clarify` | optional | spec.md | updates `spec.md` in place |
| `/speckit-plan` | ✅ | spec.md, constitution.md | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| `/speckit-tasks` | ✅ | plan.md + Phase 1 outputs | `tasks.md` |
| `/speckit-checklist` | optional | any artifact | a new or appended custom checklist file |
| `/speckit-analyze` | optional | spec/plan/tasks | a consistency report (no files written) |
| `/speckit-implement` | ✅ | tasks.md + everything above | code, `tasks.md` checked off |
| `/speckit-converge` | optional | codebase + all artifacts | appends a Convergence phase to `tasks.md` |
| `/speckit-taskstoissues` | optional | tasks.md, GitHub remote | GitHub issues |
