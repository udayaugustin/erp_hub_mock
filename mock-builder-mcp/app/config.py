"""Settings, all read from environment variables (set them in Coolify)."""
import os
from pathlib import Path


def _req(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if not v:
        raise RuntimeError(f"Missing required environment variable {name}")
    return v


class Settings:
    def __init__(self) -> None:
        # Who may call this MCP server: clients send "Authorization: Bearer <MCP_AUTH_TOKEN>".
        self.auth_token = _req("MCP_AUTH_TOKEN")

        self.data_dir = Path(os.environ.get("DATA_DIR", "/data"))
        self.repo_dir = self.data_dir / "erp_hub_mock"
        self.jobs_dir = self.data_dir / "jobs"

        # The mocks repo and where pushes go.
        self.github_repo = os.environ.get("GITHUB_REPO", "udayaugustin/erp_hub_mock")
        self.git_remote = os.environ.get("GIT_REMOTE_URL", f"https://github.com/{self.github_repo}.git")
        self.git_branch = os.environ.get("GIT_BRANCH", "main")

        # Claude Code (headless). Auth comes from ANTHROPIC_API_KEY or
        # CLAUDE_CODE_OAUTH_TOKEN in the environment; Claude Code reads it itself.
        self.claude_bin = os.environ.get("CLAUDE_BIN", "claude")
        self.claude_model = os.environ.get("CLAUDE_MODEL", "").strip()
        self.claude_max_turns = int(os.environ.get("CLAUDE_MAX_TURNS", "300"))
        self.phase_timeout = int(os.environ.get("PHASE_TIMEOUT_SECONDS", "5400"))
        # Optional spending cap per Claude Code run, in USD (API-key billing only).
        self.claude_max_budget = os.environ.get("CLAUDE_MAX_BUDGET_USD", "").strip()

        # How a finished mock is checked before it is pushed. {mock} is the folder name.
        self.verify_cmd = os.environ.get("VERIFY_CMD", "python3 {mock}/tools/verify.py")

        # Deployment through the jarvis-fleet MCP server.
        self.jarvis_url = os.environ.get("JARVIS_MCP_URL", "https://mcp.13.140.175.74.sslip.io/mcp")
        self.jarvis_token = os.environ.get("JARVIS_FLEET_TOKEN", "").strip()
        self.deploy_app_name = os.environ.get("DEPLOY_APP_NAME", "ERP Mock")
        self.deploy_host = os.environ.get("DEPLOY_HOST", "jp-contabo-vps")
        self.deploy_fqdn = os.environ.get("DEPLOY_FQDN", "https://mock.infyits.com").rstrip("/")
        self.deploy_timeout = int(os.environ.get("DEPLOY_TIMEOUT_SECONDS", "900"))

        self.public_base = os.environ.get("MOCKS_PUBLIC_URL", self.deploy_fqdn).rstrip("/")
        self.timezone = os.environ.get("TZ_NAME", "Asia/Muscat")


settings: Settings | None = None


def get() -> Settings:
    global settings
    if settings is None:
        settings = Settings()
    return settings
