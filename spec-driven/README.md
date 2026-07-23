# spec-driven/

This is the "after" side of the demo: the same task list API as `../vibe-coded/`, but
built by walking the feature description through the full spec-kit pipeline first:

`/speckit-constitution` → `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`

Every file here traces back to a specific line in the generated artifacts under
[`../specs/001-task-list-api/`](../specs/001-task-list-api/):

- `spec.md` — what the API does and why, in plain language
- `plan.md` + `research.md` — the tech choices and the reasoning behind them
- `data-model.md` + `contracts/tasks-api.md` — the `Task` shape and the exact
  request/response contract for each endpoint
- `tasks.md` — the ordered checklist this code was implemented against (see the `[X]`
  marks — this file was built task by task, not in one shot)

## Run it

```bash
npm install
npm start
```
Server listens on `http://localhost:3000`. See
[`../specs/001-task-list-api/quickstart.md`](../specs/001-task-list-api/quickstart.md)
for `curl` commands exercising every operation and edge case.
