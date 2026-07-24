# Spec-Kit Reference Docs

This repo explains spec-kit at three different altitudes:

1. **[`../README.md`](../README.md)** — the pitch. Why spec-driven development matters,
   using this repo's vibe-coded vs. spec-driven contrast as evidence.
2. **[`../PROCESS.md`](../PROCESS.md)** — the walkthrough. How the five commands
   specifically produced the artifacts in `specs/001-task-list-api/`, step by step.
3. **This directory** — the reference manual. How spec-kit itself works underneath both
   of those: the CLI, the full command roster (including the ones this demo didn't use),
   and the template system that makes both "how it's structured" and "how it's generated"
   customizable.

| Doc | Covers |
|---|---|
| [`cli-init.md`](./cli-init.md) | `specify init` — flags, integrations, what it scaffolds, and how it tracks what it installed |
| [`commands.md`](./commands.md) | Every `/speckit-*` command, not just the five this demo ran |
| [`markdown-templates.md`](./markdown-templates.md) | The two distinct template layers, how each is customized, and how content actually gets generated |
| [`extensions.md`](./extensions.md) | The hook/extension system: the catalog, real official and community extensions, and exactly what installing one changes on disk |
| [`lifecycle.md`](./lifecycle.md) | What runs once vs. what repeats: the ongoing day-to-day workflow, not just what each command does in isolation |
| [`worked-example.md`](./worked-example.md) | A full second feature run through every command, including the three optional ones this repo's real feature never needed — real prompts, real answers, real generated content |
| [`constitution-guide.md`](./constitution-guide.md) | `/speckit-constitution` specifically: how to invoke it, what its arguments look like, sample commands for every scenario, and an argument reference across all ten commands |
| [`principles.md`](./principles.md) | The idea of a *principle* itself: what separates it from a value, a task, or scope; the anatomy of a good one; and how it's actually enforced downstream once written |

Every claim in these docs is grounded in files actually present in this repo —
`.specify/`, `.claude/skills/`, and `specs/001-task-list-api/` — not spec-kit's external
documentation. Where something is a general capability we didn't exercise here (like
`/speckit-clarify`, `specify preset`, or any extension), that's called out explicitly —
`extensions.md` and `worked-example.md` in particular were verified in a disposable
scratch copy of this repo, since `speckit-demo` itself only ever ran the five core
commands once, on one feature.
