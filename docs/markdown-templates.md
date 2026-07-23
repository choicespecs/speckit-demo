# The Markdown Template System

Spec-kit has **two separate template layers** that are easy to conflate because both are
markdown files with bracketed placeholders. They're customized differently, generated
differently, and serve different purposes. Confusing them is probably the single most
common source of "wait, how does this actually work?" — so this doc treats them
separately, then explains how they connect.

## Layer A: Command templates — the instructions themselves

**Location in the spec-kit source repo**: `templates/commands/*.md` (one per command:
`constitution.md`, `specify.md`, `plan.md`, `tasks.md`, `implement.md`, etc.)
**Location once installed here**: `.claude/skills/speckit-*/SKILL.md`

These are **agent-neutral playbooks** — step-by-step instructions for *what an AI agent
should do* when a command runs (which files to read, what validation to run, what format
to write in). They are not filled in with your project's data; they're the fixed process
every project's `/speckit-specify` follows, regardless of what that project is.

You can see the link directly: open
[`.claude/skills/speckit-constitution/SKILL.md`](../.claude/skills/speckit-constitution/SKILL.md)
and look at its frontmatter:

```yaml
metadata:
  author: "github-spec-kit"
  source: "templates/commands/constitution.md"
```

**How they get generated**: `specify init --integration <agent>` takes the one generic
copy of each command template and adapts it to whatever format the chosen agent expects.
For Claude Code specifically, that means: a directory per command under
`.claude/skills/`, a `SKILL.md` with YAML frontmatter (`name`, `description`,
`argument-hint`, `user-invocable`), and every `speckit.constitution`-style dotted id
rewritten to `speckit-constitution` (see `.specify/integration.json`'s
`"invoke_separator": "-"`). A different `--integration` value produces a *different file
layout* from the *same* generic source — the instructions inside are equivalent, only the
packaging changes.

**How to customize this layer**: you generally don't hand-edit these — `specify` tracks
a checksum of each one in `.specify/integrations/claude.manifest.json` specifically so it
can detect drift from the shipped version during an upgrade. If a project genuinely needs
to change command *behavior* (not just content), spec-kit's supported mechanism is the
**extension hook system**: every installed command checks for a `.specify/extensions.yml`
file (this repo doesn't have one) with entries like `hooks.before_specify` or
`hooks.after_plan`. A hook points at another command to run automatically before/after the
main one — e.g. an extension could auto-create a git branch before every
`/speckit-specify` call, without editing `speckit-specify/SKILL.md` itself. You can see
every command checking for this in its "Pre-Execution Checks" / "Post-Execution Checks"
sections.

## Layer B: Artifact templates — the document skeletons

**Location**: `.specify/templates/*.md` — `constitution-template.md`, `spec-template.md`,
`plan-template.md`, `tasks-template.md`, `checklist-template.md`

These **are** meant to be edited per-project. They're the skeleton a command fills in —
section headings, `[BRACKET_PLACEHOLDER]` tokens, and HTML-comment examples showing what
each placeholder is for. When a command "resolves the active template," it's reading one
of these files, not the Layer A instructions.

**How they get filled in**: this is the actual content-generation step, and it happens
entirely inside the Layer A instructions — there is no separate deterministic generator.
When `/speckit-specify`'s playbook says "load the resolved spec-template, replace every
placeholder with concrete details derived from the feature description," it's telling the
AI agent (Claude, in this repo) to write that prose itself, then run it through the
validation steps also described in the playbook (e.g. the requirements-quality checklist).
We proved this concretely in this repo: when `.claude/skills/speckit-constitution` wasn't
yet registered in the running session, reading `constitution-template.md` and
`speckit-constitution/SKILL.md` by hand and following the same instructions manually
produced an equivalent result — because that's *always* what's happening, whether the
skill dispatch mechanism does it or a human copies the same steps.

**How to customize this layer**: directly. Open `.specify/templates/plan-template.md` and
add a section — e.g. an `## Accessibility Considerations` heading with its own
placeholder — and every future `/speckit-plan` run in this repo will include it, because
commands read *whichever* template currently exists at that path, not a cached or
version-pinned copy. This is also what `specify preset` automates: a preset is a
pre-authored bundle of Layer B customizations (e.g. `--preset healthcare-compliance` adds
compliance-specific sections to the constitution and plan templates) applied at `init`
time so you don't have to hand-edit them yourself.

**The two "extra" constitution sections are a Layer B customization point, not a Layer A
one.** `[SECTION_2_NAME]` / `[SECTION_3_NAME]` in `constitution-template.md` are exactly
the kind of thing you're meant to rename per project — we called them **Demo Scope
Constraints** and **Repository Layout** in this repo's
[`constitution.md`](../.specify/memory/constitution.md). See `PROCESS.md` §2 for the full
explanation of fixed principle slots vs. these free-form ones.

**Checklists are a special case worth naming explicitly**: `checklist-template.md` is a
Layer B template like the others, but it's used twice in this repo for two different
purposes — automatically, by `/speckit-specify`, to produce
[`checklists/requirements.md`](../specs/001-task-list-api/checklists/requirements.md); and
on-demand, by `/speckit-checklist` (see `commands.md`), to produce a custom checklist for
anything else a project wants gated (security, accessibility, whatever). Same template,
same format, different trigger.

## How the two layers connect, end to end

```text
templates/commands/specify.md   (Layer A, generic, lives in spec-kit's own repo)
        │
        │  specify init --integration claude  (adapts format per agent)
        ▼
.claude/skills/speckit-specify/SKILL.md   (Layer A, installed, Claude-specific packaging)
        │
        │  you run /speckit-specify  (loads these instructions into the agent's context)
        ▼
Agent reads: .specify/templates/spec-template.md   (Layer B, generic skeleton)
        │
        │  agent fills in every [BRACKET], following Layer A's instructions
        ▼
specs/001-task-list-api/spec.md   (Layer B, filled, project-specific — the real artifact)
```

Layer A answers "what should happen when this command runs, and in what packaging for my
agent." Layer B answers "what should the resulting document look like, and what does this
project specifically need to say in it." Customizing your process (hooks, presets, which
agent you target) touches Layer A's *installation*, never its content directly.
Customizing your documents' shape (extra sections, project-specific structure) touches
Layer B directly, any time.
