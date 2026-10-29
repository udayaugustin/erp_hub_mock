"""The two prompts handed to Claude Code. Each one runs part of the repo's own
mock-builder pipeline (.claude/agents/), so improving those files improves the
server without touching this code."""

COMMON = """\
You are running headless inside the mock-builder MCP server, in a clone of the
erp_hub_mock repo. Notes for this environment:
- The context-mode (ctx_*) tools named in CLAUDE.md are NOT installed here. Ignore
  CLAUDE.md's routing rules and use your normal tools (Read, Edit, Write, Bash, Agent,
  WebSearch, WebFetch).
- Do NOT run git commit, git push, or any deployment. The server does those after
  checking your work.
- Do not touch any file outside: {mock}/, docs/specs/ files for this company, and the
  root Dockerfile (one COPY line for {mock}/ only).
- Never invent facts. Keep confirmed facts and assumptions strictly separate.
"""

RESEARCH_DESIGN = COMMON + """
TASK — phases 1 and 2 of the mock-builder pipeline for: {company}

Read .claude/agents/mock-builder.md and .claude/skills/hub-mock-factory/SKILL.md first.
Then run, in order:
1. The mock-researcher subagent (Agent tool, subagent_type "mock-researcher") with the
   company name and the brief path {research}. Read the brief yourself afterwards.
2. The mock-designer subagent (subagent_type "mock-designer") with the company name, the
   brief path and the design-spec path {design}. Read the spec yourself afterwards.
   Aim for a walkthrough of about 16 steps, like wj-mock and mec-mock.
If the Agent tool is unavailable, do each phase yourself following its file in
.claude/agents/, writing the same artifacts.

Use slug "{slug}" and mock folder "{mock}/". Today is {date}.
{extra}
STOP after the design spec is written. Do not build the mock.

Your final message must be ONLY a short summary for a human reviewer, at most 8 lines:
shape and base template, the invoice streams, the tracked demo invoice, number of steps,
and anything that needs a human decision.
"""

BUILD_VERIFY = COMMON + """
TASK — phases 3 and 4 of the mock-builder pipeline for: {company}

The design spec at {design} has been approved by a human.
Human notes on the design (apply them; they override the spec): {notes}

Read .claude/agents/mock-builder.md and .claude/skills/hub-mock-factory/SKILL.md first.
Then run, in order:
1. The mock-scaffolder subagent (subagent_type "mock-scaffolder") with the company name,
   slug "{slug}" and the design-spec path. Spot-check that {mock}/ exists afterwards.
2. The mock-verifier subagent (subagent_type "mock-verifier") with the folder {mock}/.
If the Agent tool is unavailable, do each phase yourself following its file in
.claude/agents/.

The Dockerfile must contain exactly one line: COPY {mock}/ /usr/share/nginx/html/{mock}/
The job is not done until `{verify}` prints CLEAN. If it cannot be made clean, say exactly
what remains.

Your final message must be ONLY a short report, at most 8 lines: what was built, the
number of steps, the final verify result, and anything a human must confirm with the client.
"""
