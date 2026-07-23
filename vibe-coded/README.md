# vibe-coded/

This is the "before" side of the demo: the task list API built the way most people
actually prompt an AI coding agent — one message, no spec, no plan, just "build it."

## The prompt used

> Build me a simple Node.js/Express API for a task list. I should be able to add a task,
> mark it done, see all my tasks, and delete one. Keep it simple, in-memory is fine.

That's it — no follow-up questions, no clarification round. What you get is one file with
everything inline: routing, validation, and state all mixed together, and a handful of
small, ad-hoc design choices (field names, status codes, endpoint shapes) that nobody
explicitly decided — they just fell out of whatever the model produced first.

Compare this to `../spec-driven/`, which was built from the exact same feature intent but
routed through `/speckit-constitution` → `/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement` first.

## Run it

```bash
npm install
npm start
```
Server listens on `http://localhost:3001`.
