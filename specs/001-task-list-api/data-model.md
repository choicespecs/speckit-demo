# Phase 1 Data Model: Task List API

## Entity: Task

Represents a single to-do item, as defined in `spec.md` Key Entities.

| Field         | Type    | Required | Notes                                                             |
|---------------|---------|----------|--------------------------------------------------------------------|
| `id`          | integer | yes      | Assigned by the store when the task is created; immutable; unique across the process lifetime (FR-002). |
| `description` | string  | yes      | Must be non-empty after trimming whitespace; rejected otherwise (FR-001, FR-006). |
| `done`        | boolean | yes      | Defaults to `false` on creation; set to `true` by the mark-done operation (FR-004). |

## State Transitions

`done` has exactly one meaningful transition: `false → true`, triggered by marking a task
done. Marking an already-done task done again is a no-op that leaves it `true` (see
spec.md Edge Cases) — there is no operation defined to un-mark a task, since the spec
scopes exactly four operations (add, list, mark done, delete).

## Relationships

None. `Task` is the only entity; the store holds a single flat collection of tasks (no
per-user ownership, per the spec's Assumptions).

## Validation Rules

- Reject task creation when `description` is missing, empty, or whitespace-only (FR-006) —
  the store must not create a task in this case.
- Mark-done and delete operations on an unknown `id` must not modify any existing task
  (FR-007) and must be distinguishable from a successful operation by the caller.
