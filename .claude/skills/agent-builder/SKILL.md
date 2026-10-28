---
name: agent-builder
description: Playbook for creating new Claude Code subagents in this repo — the orchestrator + phase-agent pattern, frontmatter conventions, artifact-based hand-off between agents, naming scheme. Use when adding a new automated multi-step workflow as subagents, or extending an existing pipeline like mock-builder with another phase.
---

# Agent builder

This repo automates multi-step workflows as a small set of cooperating Claude Code subagents
(`.claude/agents/*.md`) rather than one monolithic agent. The worked example is the
`mock-builder` pipeline (`mock-builder` orchestrator + `mock-researcher` → `mock-designer` →
`mock-scaffolder` → `mock-verifier`, documented in `.claude/skills/hub-mock-factory/SKILL.md`).
This skill captures the *pattern*, so the next pipeline built in this repo follows the same
shape instead of reinventing it.

## Why subagents, not one big agent

Each subagent starts with a fresh context and no memory of its siblings — that's a constraint,
not a bug. Splitting a workflow into phase agents keeps each one's job small enough to specify
precisely (a short, checkable list of steps) and lets you re-run just the phase that failed
instead of the whole pipeline. The cost is that phases can't talk to each other directly — see
"How phases communicate" below.

## The two kinds of agent in a pipeline

1. **Orchestrator** (one per pipeline, named after the domain — e.g. `mock-builder`) —
   coordinates the phases. Its tools list must include `Agent` so it can invoke the others.
   It does the minimum direct work itself (mostly `Read`/`Glob` to sanity-check artifacts
   between phases) and leaves the real work to the phase agents.
2. **Phase agents** (named `<domain>-<role>`, e.g. `mock-researcher`, `mock-designer`) — each
   does exactly one step of the workflow, is only ever invoked by the orchestrator (say so
   explicitly in its `description`), and only gets the tools that one step needs.

## Frontmatter contract

```yaml
---
name: <domain>-<role>              # orchestrator: just <domain>
description: <what it does>. <when to use it>. For a phase agent, end with
  "Invoked by the <domain>-builder orchestrator, not usually called directly."
tools: <minimal list the step actually needs>
model: <picked by task complexity — see below>
---
```

Every agent file is defined by exactly these four frontmatter fields — `name`, `description`,
`tools`, `model` — plus the body. Get all four right; don't leave `model` on a default.

Keep `tools` as narrow as the step requires — a phase that only reads and writes markdown
doesn't need `Bash` or `WebSearch`. The orchestrator is the exception: it needs `Agent` plus
enough `Read`/`Glob` to verify hand-offs.

### Choosing `model` by task complexity

Don't default every agent to the same model. Judge each phase by what kind of work it actually
does, not by its position in the pipeline:

- **Mechanical / narrow / well-specified** (follows an explicit recipe, little open-ended
  judgment, failure is easy to detect) → a lighter model is enough.
- **Moderate synthesis** (research gathering + confidence judgment, iterative debugging against
  a known checklist, templated content generation across many files) → a mid-tier model —
  this is where most phase agents land.
- **High-stakes judgment with incomplete information** (deciding scope/shape from ambiguous
  signals, writing the one artifact every downstream phase depends on, trade-off calls nobody
  else in the pipeline will re-check) → the strongest model available — mistakes here are the
  most expensive to catch later, since everything downstream trusts this phase's output.

Worked example from `mock-builder`: `mock-designer` gets the strongest model because it turns
possibly-thin research into the binding shape/scope decision and the spec every later phase
builds from — a wrong call there is expensive to unwind. `mock-researcher`, `mock-scaffolder`,
`mock-verifier`, and the `mock-builder` orchestrator itself are all mid-complexity — real
synthesis or iterative work, but each is checked against something concrete (a source, a
spec, `verify.py`'s output) rather than deciding from scratch — so a mid-tier model is enough
there. Revisit the choice if a phase turns out to need more (or less) than it was given.

## Body structure (phase agent)

1. One-paragraph role statement naming which phase of which pipeline this is, and pointing at
   the domain skill (e.g. `hub-mock-factory`) for the shared playbook — don't duplicate domain
   knowledge into the agent file, reference it.
2. **Input** — exactly what the orchestrator will hand it (names, file paths). Phase agents
   should not have to guess paths; the orchestrator decides them up front (see below).
3. **Steps** — a numbered, checkable procedure. Prefer explicit steps over prose instructions —
   the next person (or agent) extending this pipeline should be able to diff the steps against
   what actually happened.
4. **Output** — the artifact it must produce (a file path, built from inputs it was given) and
   the report-back contract: a word-capped summary (this repo uses <150 words) listing what it
   produced and any caveats, so the orchestrator can relay without re-deriving anything.
5. **Rules it must not break** — anything that would silently corrupt the pipeline if skipped
   (e.g. "never invent a confirmed fact", "never skip the previous phase's artifact").

## Body structure (orchestrator)

1. List the phases in order, one line each.
2. **"How the phases communicate"** section — spell this out explicitly, it's the part that's
   easy to get wrong: phase agents share no memory, so the orchestrator must (a) decide every
   hand-off artifact's path *up front*, before invoking any phase, so every phase agrees on
   where to read/write without needing to ask; (b) after each phase returns, read its artifact
   itself rather than trusting the phase's text report blindly; (c) thread the relevant path(s)
   and findings into the next phase's prompt.
3. **Pipeline** — numbered steps, each naming which subagent to invoke, with what inputs, and
   what to check before moving on.
4. A bounded retry/escalation rule (e.g. "don't loop between two phases more than twice without
   surfacing the blocker to the user") — orchestrators must never retry silently forever.
5. **Final report** — what to summarize back to whoever invoked the orchestrator.
6. **Rules you must not break** — pipeline-wide invariants that apply across all phases (in
   `mock-builder`'s case, the domain skill's "Hard rules" section).

## Artifact hand-off convention

Pick a predictable, shared naming scheme for hand-off files and have the orchestrator compute
every path once at the start (see `mock-builder`'s "Set up" step). `mock-builder` uses
`docs/specs/<date>-<slug>-<phase-noun>.md` (`…-research.md`, `…-mock-design.md`) ending in the
final built artifact (`<slug>-mock/`). Reuse this `docs/specs/<date>-<slug>-*` convention for
any new pipeline that produces similar written artifacts, so they sit alongside existing ones
predictably.

## Checklist for adding a new pipeline (or a new phase to an existing one)

1. Write out the artifact chain first — what file does each phase read, what does it write.
2. Write each phase agent file using the body structure above.
3. Write (or update) the orchestrator, including the "how phases communicate" section and a
   bounded retry rule.
4. Cross-link: add/update an "Agent pipeline" section in the relevant domain skill (if one
   exists) describing the chain, and point back here for the general pattern.
5. Do a dry run on a throwaway input before trusting the pipeline on a real one.
