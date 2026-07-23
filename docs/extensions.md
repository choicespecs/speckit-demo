# Extensions and the Catalog

`markdown-templates.md` mentions hooks as the supported way to change command *behavior*
without hand-editing a skill file, gated behind a `.specify/extensions.yml` that this repo
doesn't have. This doc is the reference for that system: what an extension actually
contains, where they come from, and a real example of what installing one changes.

**Note on sourcing**: this repo (`speckit-demo`) has zero extensions installed — that's
still true after writing this doc. Everything below describing *what installing an
extension produces* was verified by running `specify extension add git` in a disposable
scratch directory, then deleting it. Nothing here reflects state that exists in this repo.

## The `specify extension` subcommands

```text
specify extension list          # what's installed here
specify extension search [q]    # search the catalog(s), optional query + --tag/--author/--verified
specify extension info <name>   # details on one extension
specify extension add <name>    # install
specify extension remove <name> # uninstall
specify extension update        # update installed extension(s)
specify extension enable/disable <name>   # toggle without uninstalling
specify extension set-priority <name>     # resolution order when multiple extensions hook the same event
specify extension catalog list/add/remove # manage which catalogs are searched
```

## The two built-in catalogs

```text
default (priority 1)     — Built-in catalog of installable extensions. Install allowed.
community (priority 2)   — Community-contributed extensions. Discovery only.
```

Running `specify extension search` with no query returned **145 extensions** at the time
of writing. Only **4** of those are from the `default` catalog and directly installable
with a plain `specify extension add <name>`:

| ID | Name | What it does |
|---|---|---|
| `agent-context` | Coding Agent Context | Manages agent instruction files (`CLAUDE.md`, `copilot-instructions.md`) with project-specific plan references |
| `assess` | Idea Assessment Pipeline | A pre-spec intake/research/define/shape/decide pipeline; a "go" verdict hands off into `/speckit-specify`, a "kill" closes it out |
| `bug` | Bug Triage Workflow | Assess/fix/validate bug reports against the codebase, with per-bug reports under `.specify/bugs/<slug>/` |
| `git` | Git Branching Workflow | Feature branch creation/numbering, validation, remote detection, and auto-commit hooks |

The other 141 are **community** extensions — real, browsable via `search`/`info`, but
`specify extension add <name>` refuses them by default with:

> *"Not directly installable from 'community'. Add to an approved catalog with
> `install_allowed: true`, or install from a ZIP URL:
> `specify extension add <name> --from <zip-url>`."*

That's a deliberate trust boundary: `default` is spec-kit-core's own maintained catalog;
`community` is discoverable but requires an explicit opt-in step before code from it runs
in your project. A handful of real community examples, to show the range of what people
have built: **Golden Demo** (fuzz-tests real code against a golden implementation as a
CI/CD drift gate), **Improve Extension** (audits a codebase and writes prioritized spec
prompts for the issues it finds), **BrownKit** (security/QA risk assessment for existing
brownfield codebases), **Product Forge** (a full research → spec → plan → tasks →
implement → verify → release-readiness orchestrator with human-in-the-loop gates).
`--verified` currently returns none — nothing in either catalog has been marked verified
as of this writing.

## What an extension actually is, concretely: the `git` extension

Running `specify extension add git` prints exactly what it's about to wire up:

```text
✓ Extension installed successfully!

Git Branching Workflow (v1.0.0)
Provided commands:
  • speckit.git.feature    - Create a feature branch (sequential/timestamp numbering)
  • speckit.git.validate   - Validate current branch follows naming conventions
  • speckit.git.remote     - Detect Git remote URL for GitHub integration
  • speckit.git.initialize - Initialize a Git repository with an initial commit
  • speckit.git.commit     - Auto-commit changes after a Spec Kit command completes
```

And on disk, three things change:

**1. Five new skills appear**, alongside the ten from core spec-kit —
`.claude/skills/speckit-git-feature/`, `speckit-git-validate/`, `speckit-git-remote/`,
`speckit-git-initialize/`, `speckit-git-commit/`. Each `SKILL.md`'s frontmatter points at
the extension as its source, not spec-kit core:

```yaml
metadata:
  author: github-spec-kit
  source: git:commands/speckit.git.commit.md
```

This is the same Layer A mechanism described in `markdown-templates.md` — an extension
ships its own generic command templates (`.specify/extensions/git/commands/*.md`) and
they get adapted into Claude-specific skills exactly like the core ten were.

**2. `.specify/extensions/git/` holds the extension's own package** —
`extension.yml` (the manifest: id, version, author, required tools, provided commands,
and the hooks it wants), `commands/*.md` (its Layer A templates), `git-config.yml` /
`config-template.yml` (a Layer-B-style config file specific to this extension, with
defaults like `branch_numbering: sequential`), and per-shell scripts under `scripts/`.

**3. `.specify/extensions.yml` is created**, listing the extension and every hook it
registered. The `git` extension hooks into essentially every lifecycle event — two of
them non-optional, the rest optional and interactive:

```yaml
installed:
- git
settings:
  auto_execute_hooks: true
hooks:
  before_constitution:
  - extension: git
    command: speckit.git.initialize
    enabled: true
    optional: false        # always runs — initializes a git repo before the constitution exists
    priority: 10
    description: Initialize Git repository before constitution setup
  before_specify:
  - extension: git
    command: speckit.git.feature
    enabled: true
    optional: false        # always runs — creates the feature branch before spec.md is written
    priority: 10
    description: Create feature branch before specification
  after_specify:
  - extension: git
    command: speckit.git.commit
    enabled: true
    optional: true          # asks first
    prompt: Commit specification changes?
    description: Auto-commit after specification
  # ...the same optional auto-commit hook repeats for before/after every other
  # command: clarify, plan, tasks, implement, checklist, analyze, taskstoissues
```

This is exactly the format every skill's "Pre-Execution Checks" / "Post-Execution Checks"
section is designed to read (see any `SKILL.md` in `.claude/skills/`) — `enabled`,
`optional`, `condition`, and `priority` (used when more than one extension hooks the same
event, via `specify extension set-priority`) are all fields the core commands already
know how to interpret. Installing an extension doesn't change the core commands' code at
all; it just gives them a non-empty file to find where, until now, every check has been
silently skipping.

## Why this repo doesn't use one

Per the constitution's Minimal Dependencies and Illustrative-Not-Production principles
(see [`constitution.md`](../.specify/memory/constitution.md)), adding an extension —
even the official `git` one — would pull in five more commands and an auto-commit hook a
reader would have to understand, for a demo whose entire point is the five core commands.
If this repo ever needed reproducible feature branches per spec (useful once there's more
than one feature directory under `specs/`), `git` is the extension to reach for first —
it's official, and its hooks map directly onto the exact lifecycle events already
documented throughout `.claude/skills/`.
