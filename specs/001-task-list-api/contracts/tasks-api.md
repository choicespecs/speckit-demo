# API Contract: Task List

Base path: `/tasks`. All requests and responses use JSON. This contract is the interface
`routes/tasks.js` must implement; each endpoint traces back to a functional requirement in
`spec.md`.

## POST /tasks — add a task (FR-001, FR-002, FR-006)

**Request body**: `{ "description": string }`

**Success — 201 Created**:
```json
{ "id": 1, "description": "Buy milk", "done": false }
```

**Failure — 400 Bad Request** (description missing/empty):
```json
{ "error": "description is required" }
```

## GET /tasks — list all tasks (FR-003)

**Success — 200 OK**:
```json
[
  { "id": 1, "description": "Buy milk", "done": false },
  { "id": 2, "description": "Walk the dog", "done": true }
]
```
Returns `[]` when no tasks exist (see spec.md Edge Cases).

## POST /tasks/:id/done — mark a task done (FR-004, FR-007)

**Success — 200 OK**:
```json
{ "id": 1, "description": "Buy milk", "done": true }
```

**Failure — 404 Not Found** (unknown id):
```json
{ "error": "task not found" }
```

## DELETE /tasks/:id — delete a task (FR-005, FR-007)

**Success — 204 No Content**: empty body.

**Failure — 404 Not Found** (unknown id):
```json
{ "error": "task not found" }
```
