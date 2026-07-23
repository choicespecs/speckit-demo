<!--
Sync Impact Report
- Version change: [none] → 1.0.0 (initial ratification)
- Modified principles: n/a (new document)
- Added sections: Core Principles (I–V), Demo Scope Constraints, Repository Layout, Governance
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed (generic Constitution Check gate already references this file)
  - .specify/templates/spec-template.md ✅ no changes needed
  - .specify/templates/tasks-template.md ✅ no changes needed
- Follow-up TODOs: none
-->

# Speckit Demo Constitution

## Core Principles

### I. Simplicity & Legibility (NON-NEGOTIABLE)
Every artifact in this repository — constitution, spec, plan, tasks, and code — MUST be
readable in a single pass by someone who has never seen spec-kit before. If a concept needs
more than a short paragraph to explain, the scope is too big for this demo. Prefer fewer
files, fewer moving parts, and plain language over jargon.

### II. Illustrative, Not Production
This repository exists to teach the spec-kit workflow, not to ship a usable product.
Implementations MUST stay minimal: in-memory state only, no auth, no persistence layer,
no deployment tooling, no dependency beyond what is strictly needed to demonstrate a real
API/state decision. Do not add production-readiness concerns (logging, config management,
error-handling middleware, etc.) unless the concept being taught specifically requires it.

### III. Fair Parity Between Implementations
The `vibe-coded/` and `spec-driven/` implementations MUST solve the exact same feature
scope (the task list API: add, complete, list, delete a task) with the same starting
prompt intent. Neither side may be artificially weakened or strengthened — the contrast
must come from the process used, not from an uneven starting point.

### IV. Traceability From Spec to Code
Every meaningful implementation decision in `spec-driven/` MUST be traceable back to a
line in `spec.md`, `plan.md`, or `tasks.md`. If code does something the specs don't
explain, either the code or the specs are wrong. This traceability is the entire point
of the demo and must never be sacrificed for convenience.

### V. Minimal Dependencies
Use vanilla JavaScript with Express only. No TypeScript, no build step, no test
framework, no ORM, no additional npm packages beyond `express` itself, unless a reviewer
can point to a specific teaching goal that requires one. Every added dependency is a
distraction from the spec-kit lesson.

## Demo Scope Constraints

The example feature is a task list API with exactly four operations: add a task, mark a
task done, list tasks, delete a task. State lives in memory and resets on restart — this
is a deliberate, documented simplification, not an oversight. Scope MUST NOT grow beyond
these four operations without a constitution amendment, since scope creep would blur the
before/after comparison this repo exists to make.

## Repository Layout

- `vibe-coded/` — the task list API built from a single, realistic one-shot prompt, with
  no spec-kit artifacts driving it.
- `spec-driven/` — the same API built by following `/speckit-constitution` →
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`, plus its
  own `.specify/specs/` folder containing the resulting artifacts.
- `README.md` — the narrated walkthrough tying both implementations and the spec-kit
  artifacts together for a first-time reader.

## Governance

This constitution supersedes ad-hoc conventions for this repository. Amendments require:
recording the change and rationale in this file, bumping the version per semantic
versioning (MAJOR for removing/redefining a principle, MINOR for adding one, PATCH for
wording clarifications), and updating `Last Amended`. Any pull request or change that
grows scope beyond the Demo Scope Constraints must amend this document first. Compliance
is self-reviewed against these principles before any artifact is considered final.

**Version**: 1.0.0 | **Ratified**: 2026-07-22 | **Last Amended**: 2026-07-22
