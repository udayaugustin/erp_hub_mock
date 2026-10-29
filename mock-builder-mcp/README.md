# mock-builder MCP server

An MCP server (like jarvis-fleet) that builds e-invoicing demo mocks for this repo.
Give it a company name; it runs the repo's own `agent-skills` pipeline with **Claude Code**
(research → design → build → verify), pushes the mock to `main`, and deploys it to
`mock.infyits.com` through **jarvis-fleet**. A human approves twice: **go** (after the
design) and **deploy** (after the push).

## Tools

| Tool | What it does |
|------|--------------|
| `start_mock(company, slug?, notes?, rebuild?)` | Starts a job, returns `job_id` at once |
| `job_status(job_id)` | State, recent events, progress, next step |
| `get_design(job_id)` | Design summary + full spec, for review |
| `approve(job_id, "go" \| "deploy", notes?)` | The two human approvals |
| `cancel_job(job_id)` | Cancel a waiting or failed job |
| `list_jobs()` / `list_mocks()` | Recent jobs / every mock with its link |

States: `researching → awaiting_go → building → awaiting_deploy → deploying → done`
(or `failed`, `build_failed`, `cancelled`). One open job at a time.

## Safety checks the server does itself (not left to the model)

- Before pushing: only `<slug>-mock/`, that company's `docs/specs/` files and one
  Dockerfile `COPY` line may change; `verify.py` must print `CLEAN`.
- Before deploying: the jarvis-fleet app must match name **ERP Mock**, host
  **jp-contabo-vps**, domain **mock.infyits.com**, repo and branch — otherwise it refuses.
- After deploying: the deployed commit must contain ours, and the live page must load.

## Deploy on the Contabo server (Coolify)

1. **New application** → this repo, branch `main`, **base directory `/mock-builder-mcp`**,
   build pack **Dockerfile**, port **8000**.
2. **Domain:** e.g. `https://mcp-mock.infyits.com` (point DNS at the server), or use the
   sslip address Coolify offers.
3. **Persistent storage:** a volume mounted at **`/data`** (repo clone + job history).
4. **Environment variables:** see `env.example`. Required: `MCP_AUTH_TOKEN`,
   `ANTHROPIC_API_KEY` *or* `CLAUDE_CODE_OAUTH_TOKEN`, `GITHUB_TOKEN`, `JARVIS_FLEET_TOKEN`.
5. **Resources:** at least 2 GB RAM (Chromium runs during verify).
6. Deploy, then check `https://<domain>/health` returns `{"ok":true}`.

## Connect a client

Streamable HTTP, URL `https://<domain>/mcp`, header `Authorization: Bearer <MCP_AUTH_TOKEN>`.

Claude Code:

```bash
claude mcp add --transport http mock-builder https://<domain>/mcp --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
```

goose: `goose configure` → Add Extension → Remote Extension (Streamable HTTP), same URL and header.

## Run locally

```bash
pip install -r requirements.txt && playwright install chromium
MCP_AUTH_TOKEN=dev DATA_DIR=./data GITHUB_TOKEN=... ANTHROPIC_API_KEY=... JARVIS_FLEET_TOKEN=... ./entrypoint.sh
```

Every setting has a default in `app/config.py`; `VERIFY_CMD`, `CLAUDE_BIN`, `GIT_REMOTE_URL`
and `JARVIS_MCP_URL` can be pointed at stand-ins for testing.
