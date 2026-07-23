# Spec-Kit Demo: Vibe-Coding vs. Spec-Driven Development

This repo builds the **exact same tiny feature twice** — once the way most people prompt
an AI coding agent, and once using [GitHub spec-kit](https://github.com/github/spec-kit)'s
spec-driven workflow — so you can see, concretely, what spec-driven development buys you.

The feature: a task list API. Add a task, mark it done, list tasks, delete a task. That's
it — deliberately small, so the *process* is the whole story, not the feature.

## What is spec-kit?

Spec-kit is a toolkit for **Spec-Driven Development**: instead of describing a feature to
an AI agent in one message and hoping it makes good decisions, you walk it through a
pipeline of commands that separately nail down *why* you're building it, *what* it must
do, *how* it will be built, and *what order* to build it in — before any code exists.

| Command | Answers | Produces |
|---|---|---|
| `/speckit-constitution` | What are our non-negotiable rules for this project? | `.specify/memory/constitution.md` |
| `/speckit-specify` | What must it do, and why? (no tech stack yet) | `specs/<feature>/spec.md` |
| `/speckit-plan` | How will we build it? | `specs/<feature>/plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| `/speckit-tasks` | In what order, in what pieces? | `specs/<feature>/tasks.md` |
| `/speckit-implement` | Now build it. | the actual code |

Each step's output becomes input to the next — the code at the end is downstream of a
paper trail you can read top to bottom.

## The two implementations

### [`vibe-coded/`](./vibe-coded/) — the "before"

Built from a single one-shot prompt, no spec-kit involved:

> "Build me a simple Node.js/Express API for a task list. I should be able to add a task,
> mark it done, see all my tasks, and delete one. Keep it simple, in-memory is fine."

One file, everything inline. It works — but every design decision (field names, endpoint
shapes, error format) was made once, implicitly, and never revisited.

```bash
cd vibe-coded && npm install && npm start   # listens on :3001
```

### [`spec-driven/`](./spec-driven/) — the "after"

The same feature intent, routed through the full pipeline above. The generated artifacts
live in [`specs/001-task-list-api/`](./specs/001-task-list-api/):

- [`spec.md`](./specs/001-task-list-api/spec.md) — 3 prioritized user stories, 8 functional
  requirements, success criteria, explicit assumptions
- [`plan.md`](./specs/001-task-list-api/plan.md) + [`research.md`](./specs/001-task-list-api/research.md) —
  tech choices and *why*, including a real (if small) architectural decision: state is
  isolated in `store.js` rather than inlined in route handlers
- [`data-model.md`](./specs/001-task-list-api/data-model.md) — the `Task` entity, field by field
- [`contracts/tasks-api.md`](./specs/001-task-list-api/contracts/tasks-api.md) — the exact
  request/response contract for every endpoint
- [`tasks.md`](./specs/001-task-list-api/tasks.md) — 15 tasks across 6 phases, each one
  checked off (`[X]`) as it was implemented against this document, not from memory

```bash
cd spec-driven && npm install && npm start   # listens on :3000
```

## What actually changed — a direct comparison

| | `vibe-coded/` | `spec-driven/` |
|---|---|---|
| Task text field | `text` | `description` — named in `spec.md`'s Key Entities and never renamed |
| Mark-done endpoint | `PUT /tasks/:id` — ambiguous; a PUT to "the task" happens to always just flip `done` | `POST /tasks/:id/done` — a single-purpose action, documented in the contract |
| Delete success response | `200`, no documented body | `204 No Content` — a decision made once in `contracts/tasks-api.md`, not improvised per-route |
| Error response shape | plain text (`"not found"`) | consistent `{ "error": "..." }` JSON everywhere, because the contract says so |
| Where state lives | mutated inline inside route handlers | isolated in `store.js` — a decision `research.md` explains and justifies |
| Can you point to *why* any of this is the way it is? | No — it's whatever the model produced first | Yes — every choice traces to a line in `spec.md`, `plan.md`, `data-model.md`, or `contracts/tasks-api.md` |

Neither side is a strawman: both solve the same four operations, correctly, from
equivalent starting intent (see the [constitution](.specify/memory/constitution.md)'s
"Fair Parity Between Implementations" principle). The difference isn't code quality — it's
that one side has a **paper trail** and the other doesn't.

## Why this matters

The vibe-coded version isn't *broken*. That's the point. Small inconsistencies (`text` vs.
`description`, `PUT` vs. a named action endpoint, silent design choices) are exactly the
kind of thing that don't matter for a demo — and matter a lot once a second developer, a
second feature, or a second AI session has to build on top of what's there without
knowing which decisions were deliberate. Spec-driven development front-loads that
decision-making into artifacts a human (or another AI session) can actually read.

## Reproducing this demo yourself

Everything under `.specify/` and `specs/` was generated by really running the commands
listed above against this repo — nothing here is hand-simulated. To do the same in a repo
of your own:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --integration claude
```

Then, in Claude Code: `/speckit-constitution`, `/speckit-specify "<your feature>"`,
`/speckit-plan`, `/speckit-tasks`, `/speckit-implement` — in that order.
