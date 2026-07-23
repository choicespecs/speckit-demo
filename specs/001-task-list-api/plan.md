# Implementation Plan: Task List API

**Branch**: `001-task-list-api` | **Date**: 2026-07-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-list-api/spec.md`

## Summary

A minimal REST API exposing four operations on an in-memory task list (add, list, mark
done, delete). Built with vanilla JavaScript and Express, with state isolated in a small
store module so the plan makes a real (if small) architectural decision about where state
lives, without pulling in a database.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+)

**Primary Dependencies**: Express 4.x (only runtime dependency, per constitution Principle V)

**Storage**: N/A — in-memory JavaScript array only; no database, no file persistence (per
constitution's Demo Scope Constraints)

**Testing**: N/A — no automated test framework is added (per constitution Principle V);
correctness is demonstrated manually via `quickstart.md`

**Target Platform**: Local Node.js process (developer machine); not deployed anywhere

**Project Type**: Single small web service (REST API)

**Performance Goals**: N/A — illustrative demo, not evaluated for throughput or latency

**Constraints**: In-memory state only (resets on restart); no authentication; single shared
task list (no multi-tenancy)

**Scale/Scope**: Trivial — a handful of tasks in a single demo session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicity & Legibility**: PASS — four small files total, plain Express routing, no
  framework magic or generated boilerplate.
- **II. Illustrative, Not Production**: PASS — in-memory store, no auth, no deployment
  tooling, no config management.
- **III. Fair Parity Between Implementations**: PASS — this plan implements exactly the
  four operations in `spec.md`, matching the scope the `vibe-coded/` side will also solve.
- **IV. Traceability From Spec to Code**: PASS — every functional requirement (FR-001…
  FR-008) maps to a specific route in `contracts/tasks-api.md`; see Phase 1 outputs.
- **V. Minimal Dependencies**: PASS — `express` is the only runtime dependency; no test
  framework, no build step, no TypeScript.

No violations. Complexity Tracking table is omitted (nothing to justify).

## Project Structure

### Documentation (this feature)

```text
specs/001-task-list-api/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── tasks-api.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command — not created by /speckit-plan)
```

### Source Code (repository root)

```text
spec-driven/
├── package.json         # declares the single "express" dependency
└── src/
    ├── server.js         # Express app setup, route wiring, listen()
    ├── routes/
    │   └── tasks.js       # HTTP handlers for the four operations; translates requests
    │                      # into store calls and store results into HTTP responses
    └── store.js           # In-memory task list: create/list/markDone/delete + id counter
```

**Structure Decision**: Single small web-service project. State is isolated in
`store.js` rather than inlined in route handlers — a deliberate, minimal separation
between "what the API looks like" (`routes/tasks.js`) and "where state lives"
(`store.js`), so the demo shows a real (if small) architectural decision instead of one
monolithic file. `server.js` only wires the two together and starts listening.

## Complexity Tracking

*No violations — table omitted.*
