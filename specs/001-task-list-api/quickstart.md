# Quickstart: Validating the Task List API

## Prerequisites

- Node.js 18+
- From `spec-driven/`: `npm install`

## Run

```bash
node src/server.js
```
Server listens on `http://localhost:3000` (see `server.js`).

## Validate each of the four operations

Run these in order from a second terminal; each maps to a user story in `spec.md`.

**1. Add a task (User Story 1)**
```bash
curl -s -X POST http://localhost:3000/tasks -H 'Content-Type: application/json' \
  -d '{"description":"Buy milk"}'
```
Expected: `201` with `{"id":1,"description":"Buy milk","done":false}`.

**2. List tasks (User Story 1)**
```bash
curl -s http://localhost:3000/tasks
```
Expected: `200` with an array containing the task added above.

**3. Mark the task done (User Story 2)**
```bash
curl -s -X POST http://localhost:3000/tasks/1/done
```
Expected: `200` with `{"id":1,"description":"Buy milk","done":true}`. Then re-run step 2
and confirm `done` is now `true`.

**4. Delete the task (User Story 3)**
```bash
curl -s -X DELETE http://localhost:3000/tasks/1 -o /dev/null -w '%{http_code}\n'
```
Expected: `204`. Then re-run step 2 and confirm the list no longer contains task `1`.

## Edge cases worth trying

- `POST /tasks` with `{"description":""}` → expect `400`.
- `POST /tasks/999/done` (id that doesn't exist) → expect `404`.
- `DELETE /tasks/999` (id that doesn't exist) → expect `404`.
- `GET /tasks` with no tasks ever added → expect `200` with `[]`.

See `contracts/tasks-api.md` for the full request/response contract and `spec.md` for the
requirements each behavior satisfies.
