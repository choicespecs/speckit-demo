# A Worked Example: One Full Cycle, Including Every Optional Step

`commands.md` explains what each command does. `lifecycle.md` explains when you'd reach
for it. Neither shows you an actual run, start to finish, with the optional steps
included — because this repo's real feature, `001-task-list-api`, never needed them (the
constitution's Demo Scope Constraints pre-answered everything `/speckit-clarify` exists to
ask, and the feature was small enough that `/speckit-checklist` and `/speckit-analyze`
weren't necessary). This document fills that gap.

**Everything below is real, not paraphrased.** It was produced by actually running a
second feature — "task due dates" — through every command in the Tier 3 chain, including
all three optional ones, in a disposable scratch copy of this repo (constitution,
`specs/001-task-list-api/`, and `spec-driven/` copied in, exactly like the probe
`extensions.md` used). The code was genuinely written, installed, run, and `curl`-tested.
**Nothing here touched the real `speckit-demo` repo** — there is no `specs/002-.../`
in this repo, on purpose (see `lifecycle.md`'s closing note on why this repo intentionally
stops at one feature). Where a command is normally interactive, the questions shown are
real; the answers are simulated, clearly marked as such, since there's no second person in
the loop for a scratch-copy exercise.

**The feature**: add an optional due date when creating a task, show it when listing,
never let completion touch it.

---

## Step 1 — `/speckit-specify`

```
/speckit-specify Allow an optional due date to be set when creating a task, and show it
when listing tasks. Keep it minimal — no reminders or notifications, just storing and
displaying the date.
```

**Needs**: `constitution.md` to already exist. Nothing else — this is the first artifact
for a new feature, and it creates its own numbered directory (`specs/002-task-due-dates/`,
following on from `001-task-list-api` per `feature_numbering: sequential`).

**What happened internally**: the extraction pass hit one genuine ambiguity — should a
due date carry a time of day, or just a calendar date? Both are reasonable, with
different implications (timezone handling vs. none), so per its own rule (flag only
things that materially change scope/UX with no reasonable default) it got marked, not
silently guessed. Because it's a marker `/speckit-specify` raised itself, its own
validation loop resolves it before reporting done — it doesn't get left in the file for a
separate command to pick up later:

> **Question 1 — Due date precision**
>
> | Option | Answer | Implications |
> |---|---|---|
> | A | Calendar date only (`2026-08-01`) | Simpler API, no timezone handling |
> | B | Full timestamp | Needs timezone rules, more validation surface |
> | Custom | provide your own | — |
>
> **Your choice**: _(waiting for a reply)_

*Simulated answer: **A*** — matches the "keep it minimal" framing in the original request.

**Result** — [`spec.md`](../specs/001-task-list-api/spec.md)'s real counterpart already
reflects that decision in FR-002 ("no time-of-day component"), plus a `## Clarifications`
section recording the Q&A, and `checklists/requirements.md` fully passing on the first
try — no unresolved markers left in the delivered file:

```markdown
- **FR-002**: System MUST store a provided due date as a calendar date with no
  time-of-day component (e.g. `2026-08-01`, not a timestamp).
...
## Clarifications

### Session 2026-07-23

- Q: Should a task's due date store a specific time of day, or just a calendar date? →
  A: Just a calendar date (e.g. `2026-08-01`) — no time-of-day component, keeping the
  API and validation simple.
```

---

## Step 2 — `/speckit-clarify` (optional)

```
/speckit-clarify
```

**Needs**: an existing `spec.md`. No arguments required — it works from what's already
there.

**Why we ran it here, and not for `001-task-list-api`**: `/speckit-specify`'s own
extraction pass is comparatively narrow — it resolves whatever it happens to flag while
writing the *first* draft, but it isn't running the full ambiguity taxonomy
`/speckit-clarify` uses (Functional Scope, Domain & Data Model *lifecycle rules*,
Non-Functional Quality, Terminology, and six more categories). Feature 001 never needed a
second pass because the constitution's Demo Scope Constraints had already pre-answered
nearly everything in that taxonomy before `/speckit-specify` even ran. Feature 002 touches
a genuine **lifecycle interaction** — due date × completion status — that specify's
lighter first pass didn't examine as its own category. This is exactly the gap
`/speckit-clarify` exists to catch.

**What happened internally**: the taxonomy scan flagged "Domain & Data Model → Lifecycle /
state transitions" as Partial — the spec said due dates get shown, but never said what
happens to one when its task is completed. One question, with a recommended answer stated
up front:

> **Recommended: Option A** — keep the due date visible and unchanged after completion;
> due date and completion status are independent concerns.
>
> | Option | Description |
> |---|---|
> | A | Keep due date visible after completion (informational only) |
> | B | Clear the due date when marked done |
> | C | Hide the due date in output once done |
>
> You can reply with the option letter, accept the recommendation by saying "yes," or
> provide your own answer.

*Simulated answer: **yes*** (accept the recommendation).

**Result**: the same `spec.md` gets a second bullet appended to `## Clarifications`
*immediately* — this command saves after each accepted answer, not batched at the end —
plus a new requirement:

```markdown
- **FR-005**: System MUST treat a task's due date as purely informational: marking a task
  done MUST NOT clear, alter, or hide its due date.
...
- Q: Does completing a task change how its due date is treated — hidden, cleared, or left
  as-is? → A: Left as-is. Due date is purely informational metadata; completion status and
  due date are independent.
```

The requirements checklist is then re-validated and reported as a before/after pass count
— in this case unchanged (16/16 → 16/16), since nothing regressed.

---

## Step 3 — `/speckit-plan`

```
/speckit-plan
```

**Needs**: `spec.md` (now with both clarifications folded in) and `constitution.md`.

**What happened internally**: the Constitution Check gate re-affirmed all five
principles — nothing about a due date field threatens simplicity, minimal dependencies, or
the illustrative-only scope. Phase 0 research resolved the one open technical question
("do we need a date library?") the same way feature 001 resolved its own tech choices —
Decision / Rationale / Alternatives, not just an assertion:

```markdown
## Decision: Validate due dates with native `Date` parsing, no date library

**Rationale**: The only validation needed is "is this a real calendar date." Node's
built-in `Date` constructor plus a simple `YYYY-MM-DD` format check is sufficient and
keeps `express` as the only dependency, per constitution Principle V.

**Alternatives considered**:
- `date-fns` / `dayjs` / `moment` — all capable, but adding a dependency for one field's
  validation contradicts Minimal Dependencies...
```

Phase 1 extended `data-model.md` with one new field on the existing `Task` entity rather
than a new entity, and the **Project Structure** section explicitly says *no new files* —
only `store.js` and `routes/tasks.js`, the same two files feature 001's own plan
identified as "where state lives" and "what the API looks like." This is what a small,
well-scoped increment on top of existing spec-kit output looks like: the plan for feature
two is *shorter* than feature one's, because it can point back at architecture the first
plan already justified instead of re-deciding it.

---

## Step 4 — `/speckit-checklist` (optional)

```
/speckit-checklist data validation
```

**Needs**: `spec.md` at minimum; richer if `plan.md`/`tasks.md` already exist (it did, by
this point).

**Why we ran it here**: this is a genuinely optional, on-demand command — nothing about
this feature *required* it. It's included to show what a deliberately-requested extra
quality gate looks like, beyond the standard `requirements.md` every `/speckit-specify`
run produces automatically.

**What happened internally**: it asked up to 3 dynamic scope/depth/audience questions
(skipped here since "data validation" was specific enough on its own), then generated
items in the mandatory "unit tests for English" format — every item tests whether a
*requirement* is well-specified, never whether the *code* behaves correctly:

```markdown
- [x] CHK001 Are requirements defined for both the valid-due-date and no-due-date paths? [Spec §FR-001, FR-006]
- [x] CHK005 Is "informational only" defined precisely enough to be testable, rather than left as a vague adjective? [Clarity, Spec §FR-005]
- [ ] CHK008 Is behavior specified for a due date far in the future (e.g. beyond a reasonable range)? [Gap]
```

`CHK008` is the interesting one: it's a genuine, honest gap — the spec never bounds how
far in the future a due date can be — left **unchecked** on purpose. Not every checklist
item has to pass for a feature to proceed; this is what an honest checklist looks like,
versus one padded to look complete. Written to
`specs/002-task-due-dates/checklists/data-validation.md` — a *new* file, since
`requirements.md` (from Step 1) already exists and this is a different domain; if you ran
`/speckit-checklist` again with the same domain name, it would *append*, continuing the
`CHK###` numbering rather than overwriting.

---

## Step 5 — `/speckit-tasks`

```
/speckit-tasks
```

**Needs**: `plan.md`, `spec.md`, and whichever of `data-model.md`/`contracts/`/
`research.md` exist.

**What happened internally**: because this feature is small and modifies existing files
rather than creating new ones, the phase structure compresses — one Setup line ("confirm
no new dependency is needed"), one Foundational task (extend the store), one user-story
phase, one Polish phase. Only 7 tasks total, versus feature 001's 15 — proportional to
scope, not a fixed template size:

```markdown
## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T002 Add `dueDate` to the `Task` shape and a `isValidDueDate(str)` helper in
      `spec-driven/src/store.js`...

## Phase 3: User Story 1 - Set a due date when adding a task (Priority: P1) 🎯 MVP

- [ ] T003 [US1] Update `POST /tasks` in `spec-driven/src/routes/tasks.js`...
- [ ] T004 [US1] Confirm `GET /tasks` already returns whatever shape `store.list()`
      produces — no route change needed...
- [ ] T005 [US1] Manually validate against `quickstart.md` steps 1–4...
```

---

## Step 6 — `/speckit-analyze` (optional)

```
/speckit-analyze
```

**Needs**: a complete `tasks.md` — this command refuses to run without one. **Strictly
read-only** — nothing below was written to any file; this is the actual report text.

**Why we ran it here**: also genuinely optional, included to show a real finding rather
than claim "it would probably say something like...". Cross-referencing the checklist
against the spec and tasks turned up exactly one thing worth flagging:

```markdown
## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|--------------|---------|-----------------|
| E1 | Coverage Gap | MEDIUM | checklists/data-validation.md:CHK008 | The unresolved "due date far in the future" checklist item has no corresponding task in tasks.md and no explicit non-goal in spec.md's Assumptions | Either add an explicit assumption ("no upper bound on due dates is enforced") or a follow-up task before implementation, so the gap is a documented decision rather than a silent one |

**Coverage Summary**: 6/6 functional requirements have ≥1 mapped task (100%).
**Unmapped Tasks**: T001 (Setup) — expected; setup tasks aren't tied to a specific FR.
**Metrics**: Total Requirements: 6 · Total Tasks: 7 · Coverage: 100% · Ambiguity Count: 0
· Duplication Count: 0 · Critical Issues: 0

**Next Actions**: No CRITICAL issues — safe to proceed to `/speckit-implement`. Recommend
resolving E1 (MEDIUM) by adding one line to spec.md's Assumptions before or shortly after
implementation; it does not block starting.
```

This is the realistic shape of an `/speckit-analyze` result on a small, healthy feature:
mostly clean, one honest MEDIUM finding tracing back to the same gap `/speckit-checklist`
had already surfaced as `CHK008` — the two optional commands corroborating each other
rather than each inventing something new.

*Resolution*: since E1 was MEDIUM, not CRITICAL, we proceeded to implementation without
blocking on it (documented here rather than silently dropped).

---

## Step 7 — `/speckit-implement`

```
/speckit-implement
```

**Needs**: a complete `tasks.md` and everything upstream. It checks
`checklists/requirements.md` and `checklists/data-validation.md` for incomplete items
first — since `data-validation.md` has one unchecked item (`CHK008`), a strict run would
pause and ask before proceeding. We already made that call explicitly in Step 6, so we
proceeded.

**What actually got built and verified** (real `curl` output against a real running
server, port 3000):

```bash
$ curl -s -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' \
    -d '{"description":"Buy milk","dueDate":"2026-08-01"}'
{"id":1,"description":"Buy milk","done":false,"dueDate":"2026-08-01"}

$ curl -s -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' \
    -d '{"description":"Walk the dog"}'
{"id":2,"description":"Walk the dog","done":false,"dueDate":null}

$ curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/tasks \
    -H 'Content-Type: application/json' -d '{"description":"Bad date","dueDate":"not-a-date"}'
400

$ curl -s -X POST http://localhost:3000/tasks/1/done > /dev/null
$ curl -s http://localhost:3000/tasks
[{"id":1,"description":"Buy milk","done":true,"dueDate":"2026-08-01"},
 {"id":2,"description":"Walk the dog","done":false,"dueDate":null}]
```

All four `quickstart.md` scenarios pass exactly as specified — task 1 shows `done: true`
with `dueDate` untouched, confirming FR-005. All 7 tasks flip to `[X]` in `tasks.md`.

---

## So — do you run all of these every time?

No, and this worked example is itself the evidence: feature 001 used exactly 5 commands
(no clarify, no checklist, no analyze), feature 002 used all 8. The 5 core commands are
never optional — you can't skip straight to `/speckit-tasks` without a plan, or to
`/speckit-implement` without tasks. The 3 optional ones earn their place situationally:

| Command | Ran it for 002 because... | Would skip it when... |
|---|---|---|
| `/speckit-clarify` | The feature touched a lifecycle interaction (due date × done) that `/speckit-specify`'s lighter first pass didn't examine as its own category | The constitution/spec already leaves nothing genuinely ambiguous, as in feature 001 |
| `/speckit-checklist` | Wanted an explicit, on-record quality gate for "did we think through data validation," beyond the default requirements checklist | The feature is simple enough that the default `requirements.md` checklist already covers it |
| `/speckit-analyze` | Wanted a cross-artifact sanity check before committing to implementation on a feature that touches existing shared files (`store.js`, `routes/tasks.js`) | The feature is small and isolated enough that drift between spec/plan/tasks is implausible |

The pattern: reach for an optional command when its specific value-add — a deeper
ambiguity scan, a custom quality gate, a read-only consistency check — addresses something
real about *this* feature, not as a checkbox to tick every single lap.
