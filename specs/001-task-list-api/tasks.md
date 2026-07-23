# Tasks: Task List API

**Input**: Design documents from `/specs/001-task-list-api/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tasks-api.md, quickstart.md

**Tests**: No automated test tasks are included — the constitution (Principle V) excludes
adding a test framework for this demo. Each story instead ends with a manual validation
task against `quickstart.md`.

**Organization**: Tasks are grouped by user story so each can be implemented and validated
independently, per `spec.md`'s priorities (P1 → P2 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single small web service at repository root, per `plan.md`'s Project Structure:
`spec-driven/package.json`, `spec-driven/src/server.js`, `spec-driven/src/routes/tasks.js`,
`spec-driven/src/store.js`.

---

## Phase 1: Setup

**Purpose**: Project initialization

- [X] T001 Create `spec-driven/` directory with a `src/` and `src/routes/` subfolder
- [X] T002 Initialize `spec-driven/package.json` (name, `"type": "commonjs"`, `start` script
      running `node src/server.js`) with `express` as the only dependency

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The state layer and app skeleton every user story builds on

**⚠️ CRITICAL**: No user story task can begin until this phase is complete

- [X] T003 [P] Implement the in-memory task store in `spec-driven/src/store.js`: an
      internal array plus an incrementing id counter, exposing `create(description)`,
      `list()`, `markDone(id)`, and `remove(id)` (per `data-model.md`)
- [X] T004 [P] Create `spec-driven/src/routes/tasks.js` exporting an empty Express
      `Router` (no routes yet — populated by the user story phases below)
- [X] T005 Create `spec-driven/src/server.js`: Express app with JSON body parsing,
      mounting the router from `src/routes/tasks.js` at `/tasks`, listening on port 3000
      (depends on T004)

**Checkpoint**: `node src/server.js` starts a server that responds (even with no routes
implemented yet) — foundation ready for user story work.

---

## Phase 3: User Story 1 - Add a task and see it in the list (Priority: P1) 🎯 MVP

**Goal**: A user can add a task and retrieve the list to confirm it was recorded.

**Independent Test**: Follow `quickstart.md` steps 1–2 — add a task via `POST /tasks`,
then confirm it appears via `GET /tasks`.

### Implementation for User Story 1

- [X] T006 [US1] Implement `POST /tasks` in `spec-driven/src/routes/tasks.js`: reject
      with `400` when `description` is missing/empty (FR-001, FR-006), otherwise call
      `store.create` and return `201` with the created task (contracts/tasks-api.md)
- [X] T007 [US1] Implement `GET /tasks` in `spec-driven/src/routes/tasks.js`: call
      `store.list` and return `200` with the array, including `[]` when empty (FR-003)
- [X] T008 [US1] Manually validate against `quickstart.md` steps 1–2, plus the empty-list
      and empty-description edge cases from `spec.md`

**Checkpoint**: User Story 1 is fully functional and independently testable — this is the MVP.

---

## Phase 4: User Story 2 - Mark a task as done (Priority: P2)

**Goal**: A user can mark an existing task done and see that reflected when listing tasks.

**Independent Test**: Follow `quickstart.md` step 3 — add a task, mark it done via
`POST /tasks/:id/done`, then confirm `GET /tasks` shows `done: true`.

### Implementation for User Story 2

- [X] T009 [US2] Implement `POST /tasks/:id/done` in `spec-driven/src/routes/tasks.js`:
      call `store.markDone`, return `200` with the updated task, or `404` with an error
      body when the id doesn't exist (FR-004, FR-007) (depends on T006–T007 existing in
      the same file)
- [X] T010 [US2] Manually validate against `quickstart.md` step 3, plus the unknown-id
      `404` edge case from `spec.md`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Delete a task (Priority: P3)

**Goal**: A user can delete a task they no longer need.

**Independent Test**: Follow `quickstart.md` step 4 — add a task, delete it via
`DELETE /tasks/:id`, then confirm `GET /tasks` no longer includes it.

### Implementation for User Story 3

- [X] T011 [US3] Implement `DELETE /tasks/:id` in `spec-driven/src/routes/tasks.js`:
      call `store.remove`, return `204` on success, or `404` with an error body when the
      id doesn't exist (FR-005, FR-007) (depends on T006–T009 existing in the same file)
- [X] T012 [US3] Manually validate against `quickstart.md` step 4, plus the unknown-id
      `404` edge case from `spec.md`

**Checkpoint**: All three user stories — and all four operations — are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Wrap-up that isn't specific to any one story

- [X] T013 [P] Write `spec-driven/README.md`: how to install/run, and a link back to the
      root walkthrough (per constitution's Repository Layout)
- [X] T014 [P] Add `spec-driven/.gitignore` for `node_modules/`
- [X] T015 Run the full `quickstart.md` validation end-to-end, including every edge case
      listed, and confirm every result matches `contracts/tasks-api.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phases 3–5)**: All depend on Foundational completion; must proceed in
  priority order (P1 → P2 → P3) because each story adds routes to the same
  `routes/tasks.js` file rather than touching independent files
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Within Each User Story

- Story complete and manually validated before moving to the next priority

### Parallel Opportunities

- T003 and T004 (Phase 2) touch different files and can run in parallel
- T013 and T014 (Phase 6) touch different files and can run in parallel
- Route-handler tasks within `routes/tasks.js` (T006, T007, T009, T011) touch the same
  file and must be done sequentially, in story-priority order

---

## Parallel Example: Foundational Phase

```bash
Task: "Implement the in-memory task store in spec-driven/src/store.js"
Task: "Create spec-driven/src/routes/tasks.js exporting an empty Express Router"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run `quickstart.md` steps 1–2
5. This is already a demonstrable MVP for the spec-kit walkthrough

### Incremental Delivery

1. Setup + Foundational → server runs, no routes yet
2. Add User Story 1 → validate → demonstrable (add/list)
3. Add User Story 2 → validate → demonstrable (+ mark done)
4. Add User Story 3 → validate → demonstrable (+ delete) — full feature complete

---

## Notes

- No tests are generated per the constitution; validation is manual via `quickstart.md`.
- Because all four routes live in one small `routes/tasks.js` file (Principle I:
  Simplicity & Legibility), user stories are implemented sequentially rather than in
  parallel, despite being independently testable.
- Commit after each user story phase (T008, T010, T012) to keep the demo's git history
  itself a readable artifact of incremental, spec-driven progress.
