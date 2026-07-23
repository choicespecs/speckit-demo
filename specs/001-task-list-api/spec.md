# Feature Specification: Task List API

**Feature Branch**: `001-task-list-api`

**Created**: 2026-07-22

**Status**: Draft

**Input**: User description: "A minimal task list API for the spec-driven side of a spec-kit demo repository. Users can: add a task with a text description, mark a task as done, list all tasks, and delete a task by id. This is an illustrative backend-only demo (no UI, no auth, in-memory state only) meant to show how spec-kit turns a feature description into a full spec, plan, and task breakdown. Keep scope to exactly these four operations."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a task and see it in the list (Priority: P1)

A user wants to capture something they need to do, then confirm it was recorded.

**Why this priority**: Without the ability to add and view tasks, there is no product at all — this is the minimum viable slice.

**Independent Test**: Can be fully tested by adding a task and then retrieving the list, and confirming the new task appears with the description provided.

**Acceptance Scenarios**:

1. **Given** an empty task list, **When** a user adds a task with a description, **Then** the list contains exactly one task with that description and a not-done status.
2. **Given** a task list with existing tasks, **When** a user retrieves the list, **Then** every previously added task is present with its current description and status.

---

### User Story 2 - Mark a task as done (Priority: P2)

A user wants to record that they've finished a task, so their list reflects real progress.

**Why this priority**: Tracking completion is the core value of a task list beyond a plain note; it builds directly on User Story 1.

**Independent Test**: Can be fully tested by adding a task, marking it done, then retrieving the list and confirming that task's status is now done.

**Acceptance Scenarios**:

1. **Given** a task that is not done, **When** a user marks it as done, **Then** the list shows that task with a done status.
2. **Given** a task id that does not exist, **When** a user tries to mark it done, **Then** the system reports that the task was not found and no task is altered.

---

### User Story 3 - Delete a task (Priority: P3)

A user wants to remove a task they no longer need to see.

**Why this priority**: Cleanup is useful but not essential to the core add/track loop, so it's the last priority.

**Independent Test**: Can be fully tested by adding a task, deleting it, then retrieving the list and confirming it no longer appears.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** a user deletes it by id, **Then** the list no longer contains that task.
2. **Given** a task id that does not exist, **When** a user tries to delete it, **Then** the system reports that the task was not found and no task is altered.

---

### Edge Cases

- What happens when a user tries to add a task with an empty or missing description? The system MUST reject it and report an error rather than adding a blank task.
- What happens when a user lists tasks while none exist? The system MUST return an empty list rather than an error.
- What happens when a user marks an already-done task as done again? The system treats it as already satisfied and leaves it done (no error).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a user to add a new task by providing a non-empty text description.
- **FR-002**: System MUST assign each task a unique identifier at the moment it is created.
- **FR-003**: System MUST allow a user to retrieve the full list of tasks, including each task's id, description, and done status.
- **FR-004**: System MUST allow a user to mark a specific task as done by referencing its id.
- **FR-005**: System MUST allow a user to delete a specific task by referencing its id.
- **FR-006**: System MUST reject a request to add a task when the description is empty or missing, and report the rejection clearly.
- **FR-007**: System MUST report a clear "not found" outcome when a mark-done or delete request references an id that does not exist, without altering any other task.
- **FR-008**: System MUST hold tasks only in memory for the lifetime of the running process; tasks are not persisted across restarts (per the project's Demo Scope Constraints).

### Key Entities

- **Task**: A single to-do item. Attributes: unique id, text description, and a done status (defaults to not done when created).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a task and see it reflected in the task list on the very next retrieval, with no extra steps.
- **SC-002**: A user can always tell, with 100% accuracy, whether a task is done or not by viewing the list, reflecting the most recent action taken on it.
- **SC-003**: Once a task is deleted, it never appears in any subsequent list retrieval.
- **SC-004**: Each of the four capabilities (add, list, mark done, delete) can be exercised and verified on its own — for example, listing succeeds and returns an empty result even if no task has ever been added.

## Assumptions

- There is a single shared task list rather than per-user accounts, since this is an illustrative demo, not a production multi-tenant system.
- Tasks are not persisted to disk or a database; all state resets when the server process restarts.
- No authentication or authorization is required to use the API, consistent with the demo's illustrative-only scope.
- Task descriptions are free-form text with no enforced maximum length, only a non-empty requirement.
