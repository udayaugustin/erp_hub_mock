"""Deploys the mocks site through the jarvis-fleet MCP server.

Only ever touches the one app named in the settings (name + host + domain + repo
must all match), so a wrong match can never redeploy someone else's app."""
import asyncio
import json
import time

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

from . import config


class DeployError(Exception):
    pass


async def _call(session: ClientSession, tool: str, args: dict) -> dict:
    res = await session.call_tool(tool, args)
    text = "".join(getattr(c, "text", "") for c in res.content)
    if res.isError:
        raise DeployError(f"jarvis-fleet {tool} failed: {text[:400]}")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise DeployError(f"jarvis-fleet {tool} returned non-JSON: {text[:200]}")


async def _deploy(log, expect_commit: str | None) -> dict:
    s = config.get()
    if not s.jarvis_token:
        raise DeployError("JARVIS_FLEET_TOKEN is not set on the server")
    headers = {"Authorization": f"Bearer {s.jarvis_token}"}
    async with streamablehttp_client(s.jarvis_url, headers=headers) as (r, w, _):
        async with ClientSession(r, w) as session:
            await session.initialize()

            found = await _call(session, "find_app", {"query": s.github_repo.split("/")[-1], "fresh": True})
            matches = [m for m in found.get("matches", [])
                       if m.get("name") == s.deploy_app_name
                       and m.get("host") == s.deploy_host
                       and (m.get("fqdn") or "").rstrip("/") == s.deploy_fqdn]
            if len(matches) != 1:
                raise DeployError(f"expected exactly one '{s.deploy_app_name}' app on {s.deploy_host} "
                                  f"({s.deploy_fqdn}); found {len(matches)}")
            app = matches[0]

            status = await _call(session, "app_status", {"host": app["host"], "uuid": app["uuid"]})
            if status.get("repo") != s.github_repo or status.get("branch") != s.git_branch:
                raise DeployError(f"app {app['uuid']} builds {status.get('repo')}@{status.get('branch')}, "
                                  f"not {s.github_repo}@{s.git_branch}; refusing to deploy")

            log(f"Redeploying '{s.deploy_app_name}' ({s.deploy_fqdn}) on {s.deploy_host}")
            started = await _call(session, "redeploy",
                                  {"host": app["host"], "uuid": app["uuid"], "confirm": True})
            dep = started.get("deployment_uuid")
            if not dep:
                raise DeployError(f"redeploy did not return a deployment id: {started}")

            deadline = time.monotonic() + s.deploy_timeout
            last = {}
            while time.monotonic() < deadline:
                await asyncio.sleep(10)
                last = await _call(session, "deployment_status",
                                   {"host": app["host"], "deployment_uuid": dep, "log_lines": 15})
                st = last.get("status")
                if st == "finished":
                    commit = last.get("commit", "")
                    log(f"Deployment {dep} finished (commit {commit[:8]})")
                    if expect_commit and commit not in ("HEAD", "") and not commit.startswith(expect_commit[:7]):
                        log(f"Note: deployed commit {commit[:8]} is newer than ours ({expect_commit[:8]})")
                    return last
                if st == "failed":
                    tail = "\n".join(last.get("log_tail", [])[-15:])
                    raise DeployError(f"deployment {dep} failed:\n{tail}")
            raise DeployError(f"deployment {dep} did not finish within {s.deploy_timeout}s "
                              f"(last status: {last.get('status')})")


def deploy(log, expect_commit: str | None = None) -> dict:
    return asyncio.run(_deploy(log, expect_commit))
