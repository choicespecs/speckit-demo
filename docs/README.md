# Spec-Kit Reference Docs

Three documents in this repo explain spec-kit at three different altitudes:

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

Every claim in these docs is grounded in files actually present in this repo —
`.specify/`, `.claude/skills/`, and `specs/001-task-list-api/` — not spec-kit's external
documentation. Where something is a general capability we didn't exercise here (like
`/speckit-clarify`, `specify preset`, or any extension), that's called out explicitly —
`extensions.md` in particular was verified in a disposable scratch repo, since this repo
itself has none installed.
