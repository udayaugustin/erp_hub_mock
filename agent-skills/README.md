# Agent skills — mock-builder orchestration

A shareable copy of this repo's Claude Code subagents and skills (the live versions are in
`.claude/agents/` and `.claude/skills/`). Together they turn a company name into a finished
`<company>-mock/` demo hub.

## How the pipeline fits together

```
mock-builder (orchestrator)
  ├─ 1. mock-researcher  → researches the company, writes a brief to docs/specs/
  ├─ 2. mock-designer    → reads the brief, picks the base template, writes the design spec
  ├─ 3. mock-scaffolder  → builds <company>-mock/ from the approved spec
  └─ 4. mock-verifier    → runs tools/verify.py, fixes issues, re-runs until clean
```

Each phase hands off through a file (brief → spec → mock folder), so any phase can be re-run
on its own.

| File | What it is |
|------|------------|
| `agents/mock-builder.md` | Orchestrator — runs the four phases in order |
| `agents/mock-researcher.md` | Phase 1: company research |
| `agents/mock-designer.md` | Phase 2: design spec |
| `agents/mock-scaffolder.md` | Phase 3: build the mock |
| `agents/mock-verifier.md` | Phase 4: verify and fix |
| `skills/hub-mock-factory/SKILL.md` | Playbook for how mocks in this repo are scoped and built |
| `skills/agent-builder/SKILL.md` | Playbook for adding new agents / pipeline phases |

## Using them

Inside this repo they already work — Claude Code loads them from `.claude/`.

To use them in another project, copy them into that project's `.claude/` folder:

```bash
cp -r agent-skills/agents agent-skills/skills /path/to/project/.claude/
```

Or into `~/.claude/agents` and `~/.claude/skills` to make them available in every project.

Then ask Claude Code something like: *"Build a mock for Acme Trading LLC"* — it will pick up
`mock-builder` and run the pipeline.

## Keeping this copy in sync

This folder is a snapshot. When you change an agent or skill in `.claude/`, re-copy it here:

```bash
cp -r .claude/agents .claude/skills agent-skills/
```
