# What a Principle Actually Is

`constitution-guide.md` covers how to *invoke* `/speckit-constitution` — the argument
format, the sample commands, the version-bump rules. This doc is one level up from that:
what makes a sentence a **principle** at all, as opposed to a preference, a task, or an
implementation detail — and how to write ones that actually do their job once they're in
`constitution.md`.

## Why a constitution needs principles instead of a wishlist

A README can say "we value simplicity." That's a value, not a principle — nothing checks
it, nothing fails if it's violated, and two people can read it and disagree about whether
a given PR honors it. A principle is a value with **teeth**: it's phrased so that a later
step in the pipeline (a human or `/speckit-plan`'s Constitution Check gate) can look at a
concrete decision and say PASS or FAIL, not "sort of."

This repo's own [`constitution.md`](../.specify/memory/constitution.md) exists to prove
that distinction. Compare:

> "This project should stay simple." — a value. Unfalsifiable. Everyone agrees, no one
> knows what it forbids.

against Principle I as actually written:

> "Every artifact in this repository — constitution, spec, plan, tasks, and code — MUST
> be readable in a single pass by someone who has never seen spec-kit before. If a concept
> needs more than a short paragraph to explain, the scope is too big for this demo."

The second version gives you a **test**: hand any artifact to someone unfamiliar with
spec-kit, time how long it takes them to get it, and if it needs more than a short
paragraph of explanation, the principle is violated. That's the whole difference — a
principle is a value phrased so it can be checked, not just admired.

## The anatomy of a principle

Looking at all five principles in this repo's constitution, they share a consistent shape,
and it's worth naming the parts:

1. **A name that fits on one line** — `Simplicity & Legibility`, `Minimal Dependencies`.
   This is what gets referenced everywhere downstream ("per constitution Principle V" in
   `worked-example.md:154`), so it needs to be short enough to cite in passing.
2. **A MUST/MUST NOT statement** — the enforceable core. Principle V: "Use vanilla
   JavaScript with Express only... unless a reviewer can point to a specific teaching goal
   that requires one." Notice the escape hatch is explicit and narrow, not implied.
3. **A rationale, inline** — not a separate section, but folded into the same paragraph.
   Principle V doesn't just ban dependencies; it says why: "every added dependency is a
   distraction from the spec-kit lesson." Without the rationale, an amendment years later
   has nothing to weigh the rule against — you'd be guessing at intent.
4. **An optional `(NON-NEGOTIABLE)` tag** — reserved for the one or two principles where
   even a well-argued exception should be refused. This repo uses it exactly once, on
   Principle I. If everything is tagged non-negotiable, the tag stops meaning anything —
   treat it as a scarce marker, not a default.

A principle missing part 2 (no MUST, no falsifiable claim) is really a value in disguise.
A principle missing part 3 (no rationale) will get amended into meaninglessness the first
time someone wants an exception, because there's no "why" to argue against.

## What makes something a *principle* vs. something else

`/speckit-constitution`'s "Scope Guard" (see `constitution-guide.md`'s "What NOT to put in
the arguments" section) is the sharpest version of this test, but it's worth internalizing
the categories yourself before you ever type the command:

| If it's phrased as... | It's actually a... | Where it belongs |
|---|---|---|
| "The system MUST always/never..." | A principle | `constitution.md` |
| "Add X feature" / "fix Y bug" | An implementation task | `/speckit-specify` or direct code change |
| "I think we should probably..." | An unresolved preference | Discuss first, then phrase as a MUST if it survives |
| "This feature specifically needs..." | A spec-level requirement | `spec.md`'s Functional Requirements, not the constitution |
| "Only true for this one feature" | Scope, not governance | The feature's own spec/plan |

That last row is the one people get wrong most often: "the task list API resets on
restart" sounds like it could be a principle, but it's describing *this demo's specific
feature*, not a rule that would still apply if the repo built a second feature next month.
This repo actually did draw that line: the four-operations, in-memory-state rule lives in
**Demo Scope Constraints** — one of the two free-form sections — not among the five
numbered Core Principles. A principle has to survive contact with a feature the author
hasn't thought of yet; a scope constraint is allowed to be specific to what's being built
right now. See `markdown-templates.md`'s explanation of fixed principle slots vs. free-form
sections for the mechanical side of that same distinction.

## How many principles is enough?

`constitution-template.md` ships five numbered slots
(`[PRINCIPLE_1_NAME]`–`[PRINCIPLE_5_NAME]`), which is a strong hint from spec-kit's authors
about the right order of magnitude, not a hard limit. Five is small enough that a reader
can hold all of them in their head while reviewing any single artifact — which is itself
an application of Principle I to the constitution's own design. If you find yourself
wanting a sixth or seventh, ask first whether two of your candidates are actually the same
principle stated twice at different altitudes (e.g. "no ORM" and "minimal dependencies" —
this repo folded the former into the latter as one example under Principle V, rather than
giving it its own slot).

## How a principle gets used after you write it

Writing a principle isn't the end state — it's referenced at every later step of the
pipeline, which is exactly why the phrasing has to be checkable:

- **`/speckit-plan`'s Constitution Check gate** (`plan-template.md:39`) evaluates every
  principle explicitly before Phase 0 research is allowed to start, and again after Phase
  1 design — "Gates determined based on constitution file" isn't a formality, it's a real
  PASS/FAIL per principle. A principle with no falsifiable MUST has nothing for this gate
  to check.
- **`/speckit-analyze`** treats any violation of a constitution MUST as automatically
  **CRITICAL** severity (`commands.md:128`) — the one place severity isn't judgment-called,
  because governance is deliberately weighted above every other kind of finding.
- **`Complexity Tracking`** (`plan-template.md:106-113`) is the sanctioned escape hatch: if
  a plan genuinely needs to violate a principle, it's recorded as a table row — violation,
  why it's needed, why the simpler alternative was rejected — rather than silently
  ignored. This only works because the principle was specific enough to know it was being
  violated in the first place.
- **Amendments cascade.** When you tighten or loosen a principle via
  `/speckit-constitution`, the command re-reads every template and installed command file
  looking for now-stale references (`constitution-guide.md`'s step 4). A vague principle
  can't be checked for staleness the same way — there's nothing concrete to search for.

## A short checklist for writing your own

Before adding a sentence to `constitution.md` (by hand or via
`/speckit-constitution`), ask:

1. **Is there a MUST or MUST NOT?** If the sentence is true regardless of what anyone does,
   it's not a rule yet.
2. **Could a plan or PR fail this, concretely?** If you can't picture what a violation
   would look like, the Constitution Check gate can't either.
3. **Does it carry its own rationale?** A bare rule invites erosion the first time someone
   wants an exception and finds nothing to argue against.
4. **Would it survive a feature you haven't built yet?** If it only makes sense for the
   feature in front of you, it's scope — put it in a named free-form section (see
   `markdown-templates.md`), not among the Core Principles.
5. **Does `(NON-NEGOTIABLE)` actually mean no exceptions, ever?** Only reach for it if the
   answer is genuinely yes — this repo uses it once, on purpose.

Everything else — how to phrase the actual `/speckit-constitution` invocation, what the
version bump will be, what happens to non-governance text you accidentally include — is
covered in [`constitution-guide.md`](./constitution-guide.md).
