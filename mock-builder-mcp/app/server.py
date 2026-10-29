"""mock-builder MCP server.

Give it a company name and it builds an e-invoicing demo mock in erp_hub_mock with
Claude Code (following the repo's agent-skills), pushes it to main after a human
approves, and deploys it to the mocks site through jarvis-fleet after a second
approval.  Transport: streamable HTTP at /mcp, bearer-token auth.
"""
import hmac
import json
import os

import anyio
import uvicorn
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings

from . import config, jobs

INSTRUCTIONS = """Builds Fawtara e-invoicing demo mocks ("<company>-mock") for prospects.
Workflow: start_mock(company) -> poll job_status until state is awaiting_go ->
get_design and show it to a human -> approve(job_id, "go") only when a human says so ->
poll until awaiting_deploy -> approve(job_id, "deploy") only when a human says so ->
poll until done; the live link is in live_url. Only one job can be open at a time.
Never approve on your own; both approvals must come from a human."""

mcp = FastMCP(
    "mock-builder",
    instructions=INSTRUCTIONS,
    host="0.0.0.0",
    stateless_http=True,
    json_response=True,
    transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False),
)


def _out(obj) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False)


@mcp.tool()
async def start_mock(company: str, slug: str | None = None, notes: str | None = None,
                     rebuild: bool = False) -> str:
    """Start building a mock for a company. Returns a job_id at once; the research and
    design run in the background (typically 10-30 minutes).
    company: the legal or trading name, e.g. "Muscat Engineering Consultancy LLC".
    slug: optional folder name (lowercase, hyphens); defaults to one made from the name.
    notes: optional hints for the research, e.g. the company website or known ERP.
    rebuild: set true to rebuild a mock that already exists."""
    job = await anyio.to_thread.run_sync(jobs.start, company, slug, notes, rebuild)
    return _out({"job_id": job.id, "company": job.data["company"], "mock": job.data["mock"],
                 "state": job.data["state"],
                 "next_step": "Poll job_status(job_id) until state is awaiting_go."})


@mcp.tool()
async def job_status(job_id: str) -> str:
    """Current state of a job, recent events and progress, and what to do next.
    States: researching, awaiting_go, building, build_failed, awaiting_deploy,
    deploying, done, failed, cancelled."""
    job = await anyio.to_thread.run_sync(jobs.load, job_id)
    return _out(jobs.status(job))


@mcp.tool()
async def get_design(job_id: str) -> str:
    """The design summary and full design spec for a job, for a human to review
    before approving 'go'."""
    def read():
        job = jobs.load(job_id)
        s = config.get()
        p = s.repo_dir / job.data["design"]
        spec = p.read_text()[:20000] if p.exists() else "(design spec not written yet)"
        return {"state": job.data["state"], "summary": job.data.get("design_summary", ""),
                "design_spec_path": job.data["design"], "design_spec": spec}
    return _out(await anyio.to_thread.run_sync(read))


@mcp.tool()
async def approve(job_id: str, decision: str, notes: str | None = None) -> str:
    """Human approval. Call ONLY when a human has explicitly approved.
    decision "go": build the mock from the design (state awaiting_go or build_failed);
    notes are corrections to the design.
    decision "deploy": publish the pushed mock to the live site (state awaiting_deploy)."""
    job = await anyio.to_thread.run_sync(jobs.approve, job_id, decision, notes)
    return _out({"job_id": job.id, "state": job.data["state"]})


@mcp.tool()
async def cancel_job(job_id: str) -> str:
    """Cancel a job that is waiting for approval or whose build failed. Local,
    unpushed changes are discarded."""
    job = await anyio.to_thread.run_sync(jobs.cancel, job_id)
    return _out({"job_id": job.id, "state": job.data["state"]})


@mcp.tool()
async def list_jobs(limit: int = 10) -> str:
    """Recent jobs, newest first."""
    def read():
        return [{k: j.data.get(k) for k in ("id", "company", "mock", "state", "created", "updated", "live_url")}
                for j in jobs.all_jobs()[:max(1, min(limit, 50))]]
    return _out(await anyio.to_thread.run_sync(read))


@mcp.tool()
async def list_mocks() -> str:
    """Every mock on the main branch, with its public link."""
    return _out(await anyio.to_thread.run_sync(jobs.list_mocks))


# ---------------------------------------------------------------- HTTP wrapper
class App:
    """Bearer-token check in front of the MCP endpoint, plus /health."""

    def __init__(self, inner):
        self.inner = inner
        self.token = config.get().auth_token.encode()

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            if scope["path"] == "/health":
                await self._reply(send, 200, b'{"ok":true}')
                return
            auth = dict(scope.get("headers") or []).get(b"authorization", b"")
            if not (auth.startswith(b"Bearer ") and hmac.compare_digest(auth[7:].strip(), self.token)):
                await self._reply(send, 401, b'{"error":"unauthorized"}')
                return
        await self.inner(scope, receive, send)

    @staticmethod
    async def _reply(send, code, body):
        await send({"type": "http.response.start", "status": code,
                    "headers": [(b"content-type", b"application/json")]})
        await send({"type": "http.response.body", "body": body})


def main() -> None:
    config.get()                      # fail fast on missing settings
    config.get().jobs_dir.mkdir(parents=True, exist_ok=True)
    jobs.recover_after_restart()
    app = App(mcp.streamable_http_app())
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")), log_level="info")


if __name__ == "__main__":
    main()
