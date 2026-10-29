"""Mock-building jobs: state on disk, one open job at a time, each phase run in a
background thread so MCP calls return at once.

Lifecycle:
  researching -> awaiting_go -> building -> awaiting_deploy -> deploying -> done
  any phase can end in failed; awaiting_* can be cancelled.
  approve("go") is also accepted from build_failed, to retry the build.
"""
import json
import re
import shutil
import subprocess
import threading
import time
import unicodedata
import urllib.request
import uuid
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from . import config, jarvis, prompts

OPEN_STATES = {"researching", "awaiting_go", "building", "build_failed", "awaiting_deploy", "deploying"}
BUSY_STATES = {"researching", "building", "deploying"}
LEGAL_SUFFIXES = {"llc", "l.l.c", "saoc", "saog", "spc", "co", "company", "ltd", "limited",
                  "fze", "fzc", "wll", "est", "establishment", "group", "holding", "holdings", "and", "the", "&"}

_lock = threading.RLock()
_repo_lock = threading.Lock()


# ---------------------------------------------------------------- utilities
def now() -> str:
    return datetime.now(ZoneInfo(config.get().timezone)).strftime("%Y-%m-%d %H:%M:%S")


def today() -> str:
    return datetime.now(ZoneInfo(config.get().timezone)).strftime("%Y-%m-%d")


def make_slug(company: str) -> str:
    """'Muscat Engineering Consultancy LLC' -> 'muscat-engineering-consultancy'."""
    t = unicodedata.normalize("NFKD", company).encode("ascii", "ignore").decode().lower()
    words = [w for w in re.split(r"[^a-z0-9]+", t) if w and w not in LEGAL_SUFFIXES]
    slug = "-".join(words[:4])
    if not slug:
        raise ValueError("could not make a slug from that company name; pass slug explicitly")
    return slug


def git(*args: str, check: bool = True, timeout: int = 300) -> str:
    s = config.get()
    p = subprocess.run(["git", *args], cwd=s.repo_dir, capture_output=True, text=True, timeout=timeout)
    if check and p.returncode != 0:
        raise RuntimeError(f"git {' '.join(args[:2])} failed: {(p.stderr or p.stdout).strip()[:500]}")
    return p.stdout.strip()


def ensure_repo() -> None:
    s = config.get()
    if not (s.repo_dir / ".git").exists():
        s.repo_dir.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "clone", "--branch", s.git_branch, s.git_remote, str(s.repo_dir)],
                       check=True, capture_output=True, text=True, timeout=600)


def reset_repo() -> None:
    """Throw away local changes and match the remote branch exactly."""
    s = config.get()
    ensure_repo()
    git("fetch", "origin", s.git_branch)
    git("checkout", "-B", s.git_branch, f"origin/{s.git_branch}")
    git("reset", "--hard", f"origin/{s.git_branch}")
    git("clean", "-fd")


# ---------------------------------------------------------------- job store
class Job:
    def __init__(self, data: dict):
        self.data = data

    @property
    def id(self) -> str:
        return self.data["id"]

    @property
    def dir(self) -> Path:
        return config.get().jobs_dir / self.id

    def save(self) -> None:
        with _lock:
            self.dir.mkdir(parents=True, exist_ok=True)
            tmp = self.dir / "job.json.tmp"
            tmp.write_text(json.dumps(self.data, indent=2))
            tmp.replace(self.dir / "job.json")

    def log(self, msg: str) -> None:
        line = f"[{now()}] {msg}"
        with _lock:
            self.dir.mkdir(parents=True, exist_ok=True)
            with open(self.dir / "events.log", "a") as f:
                f.write(line + "\n")
            self.data["updated"] = now()
            self.save()

    def set_state(self, state: str, msg: str | None = None) -> None:
        with _lock:
            self.data["state"] = state
            self.save()
        if msg:
            self.log(msg)

    def tail(self, name: str, n: int) -> list[str]:
        p = self.dir / name
        if not p.exists():
            return []
        return p.read_text(errors="replace").splitlines()[-n:]


def load(job_id: str) -> Job:
    p = config.get().jobs_dir / job_id / "job.json"
    if not p.exists():
        raise KeyError(f"no job {job_id}")
    return Job(json.loads(p.read_text()))


def all_jobs() -> list[Job]:
    d = config.get().jobs_dir
    if not d.exists():
        return []
    jobs = [Job(json.loads(p.read_text())) for p in d.glob("*/job.json")]
    return sorted(jobs, key=lambda j: j.data["created"], reverse=True)


def open_job() -> Job | None:
    for j in all_jobs():
        if j.data["state"] in OPEN_STATES:
            return j
    return None


def recover_after_restart() -> None:
    """A phase that was running when the server stopped cannot be resumed."""
    for j in all_jobs():
        st = j.data["state"]
        if st == "researching":
            j.set_state("failed", "Server restarted during research/design; start the job again.")
        elif st == "building":
            j.set_state("build_failed", "Server restarted during the build; approve 'go' again to retry.")
        elif st == "deploying":
            j.set_state("awaiting_deploy", "Server restarted during deployment; approve 'deploy' again.")


# ---------------------------------------------------------------- Claude Code
def run_claude(job: Job, prompt: str, label: str) -> str:
    """Run Claude Code headless in the repo. Streams a readable log; returns the final message."""
    s = config.get()
    cmd = [s.claude_bin, "-p", prompt, "--output-format", "stream-json", "--verbose",
           "--dangerously-skip-permissions", "--max-turns", str(s.claude_max_turns)]
    if s.claude_model:
        cmd += ["--model", s.claude_model]
    if s.claude_max_budget:
        cmd += ["--max-budget-usd", s.claude_max_budget]
    raw = open(job.dir / f"claude-{label}.jsonl", "w")
    readable = open(job.dir / "progress.log", "a")
    result_text, is_error = "", False
    job.log(f"Claude Code started ({label})")
    proc = subprocess.Popen(cmd, cwd=s.repo_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, bufsize=1)
    killer = threading.Timer(s.phase_timeout, proc.kill)
    killer.start()
    try:
        for line in proc.stdout:
            raw.write(line)
            try:
                ev = json.loads(line)
            except json.JSONDecodeError:
                readable.write(line[:300].rstrip() + "\n")
                continue
            if ev.get("type") == "assistant":
                for c in ev.get("message", {}).get("content", []):
                    if c.get("type") == "text" and c.get("text", "").strip():
                        readable.write(f"[{now()}] {c['text'].strip()[:400]}\n")
                    elif c.get("type") == "tool_use":
                        inp = c.get("input", {})
                        hint = inp.get("description") or inp.get("file_path") or inp.get("subagent_type") or ""
                        readable.write(f"[{now()}]   · {c.get('name')} {str(hint)[:120]}\n")
            elif ev.get("type") == "result":
                result_text = ev.get("result") or ""
                is_error = bool(ev.get("is_error")) or ev.get("subtype") not in (None, "success")
                cost = ev.get("total_cost_usd")
                if cost is not None:
                    job.data.setdefault("cost_usd", {})[label] = cost
            readable.flush()
        rc = proc.wait()
    finally:
        killer.cancel()
        raw.close()
        readable.close()
    if killer.finished.is_set() and rc != 0:
        raise RuntimeError(f"Claude Code timed out after {s.phase_timeout}s")
    if rc != 0 or is_error:
        raise RuntimeError(f"Claude Code ended with an error (exit {rc}): {result_text[:500]}")
    job.log(f"Claude Code finished ({label})")
    return result_text.strip()


# ---------------------------------------------------------------- checks
def allowed_change(path: str, job: Job) -> bool:
    slug, mock = job.data["slug"], job.data["mock"]
    return (path.startswith(f"{mock}/") or path == "Dockerfile"
            or (path.startswith("docs/specs/") and slug in path))


def changed_paths() -> list[str]:
    """Every changed or new file. Uses NUL-separated output so status columns and
    unusual file names are never mangled."""
    s = config.get()
    out = subprocess.run(["git", "status", "--porcelain", "-z", "--untracked-files=all"],
                         cwd=s.repo_dir, capture_output=True, text=True, check=True).stdout
    entries = out.split("\0")
    paths, i = [], 0
    while i < len(entries):
        e = entries[i]
        if len(e) > 3:
            paths.append(e[3:])
            if e[0] in "RC":          # rename/copy: the next entry is the old name
                i += 1
        i += 1
    return paths


def ensure_docker_line(job: Job) -> None:
    s = config.get()
    mock = job.data["mock"]
    df = s.repo_dir / "Dockerfile"
    text = df.read_text()
    line = f"COPY {mock}/ /usr/share/nginx/html/{mock}/"
    if re.search(rf"^COPY\s+{re.escape(mock)}/", text, re.M):
        return
    m = list(re.finditer(r"^COPY .*$", text, re.M))
    pos = m[-1].end() if m else len(text)
    df.write_text(text[:pos] + "\n" + line + text[pos:])
    job.log("Added the Dockerfile COPY line")


def run_verify(job: Job) -> tuple[bool, str]:
    s = config.get()
    cmd = s.verify_cmd.format(mock=job.data["mock"])
    p = subprocess.run(cmd, shell=True, cwd=s.repo_dir, capture_output=True, text=True, timeout=900)
    out = (p.stdout + p.stderr).strip()
    (job.dir / "verify.log").write_text(out)
    ok = p.returncode == 0 and "CLEAN" in out.splitlines()[-1] if out else False
    return ok, "\n".join(out.splitlines()[-25:])


def live_check(url: str, company: str) -> str:
    last = "no response"
    for attempt in range(6):
        try:
            with urllib.request.urlopen(url, timeout=20) as r:
                body = r.read().decode("utf-8", "replace")
                if r.status == 200:
                    word = company.split()[0].lower()
                    return "ok" if word in body.lower() else "loads, but the company name was not found on the page"
                last = f"HTTP {r.status}"
        except Exception as e:  # noqa: BLE001 — report any network error the same way
            last = str(e)
        time.sleep(10)
    return f"not reachable: {last}"


# ---------------------------------------------------------------- phases
def _phase(job: Job, fn) -> None:
    def runner():
        try:
            fn(job)
        except Exception as e:  # noqa: BLE001 — every failure is recorded on the job
            job.data["error"] = str(e)[:2000]
            fail_state = "build_failed" if job.data["state"] == "building" else (
                "awaiting_deploy" if job.data["state"] == "deploying" else "failed")
            job.set_state(fail_state, f"FAILED: {str(e)[:500]}")
    threading.Thread(target=runner, daemon=True).start()


def _research_design(job: Job) -> None:
    with _repo_lock:
        reset_repo()
        d = job.data
        extra = f"Requester's notes: {d['notes']}\n" if d.get("notes") else ""
        summary = run_claude(job, prompts.RESEARCH_DESIGN.format(
            company=d["company"], slug=d["slug"], mock=d["mock"], date=d["date"],
            research=d["research"], design=d["design"], extra=extra), "design")
        s = config.get()
        for key in ("research", "design"):
            if not (s.repo_dir / d[key]).exists():
                raise RuntimeError(f"Claude Code did not write {d[key]}")
        bad = [p for p in changed_paths() if not allowed_change(p, job)]
        if bad:
            raise RuntimeError(f"unexpected files changed: {bad[:10]}")
        d["design_summary"] = summary[:3000]
        job.set_state("awaiting_go", "Design ready — waiting for a human to approve 'go'.")


def _build(job: Job) -> None:
    with _repo_lock:
        s = config.get()
        d = job.data
        verify = s.verify_cmd.format(mock=d["mock"])
        report = run_claude(job, prompts.BUILD_VERIFY.format(
            company=d["company"], slug=d["slug"], mock=d["mock"], design=d["design"],
            notes=d.get("go_notes") or "none", verify=verify), "build")
        d["build_report"] = report[:3000]
        if not (s.repo_dir / d["mock"] / "index.html").exists():
            raise RuntimeError(f"{d['mock']}/index.html was not created")
        ensure_docker_line(job)
        bad = [p for p in changed_paths() if not allowed_change(p, job)]
        if bad:
            raise RuntimeError(f"build changed files outside the mock: {bad[:10]}")

        job.log("Running verify.py (server check)")
        ok, tail = run_verify(job)
        d["verify_tail"] = tail
        if not ok:
            raise RuntimeError("verify.py is not CLEAN:\n" + tail)
        job.log("verify.py CLEAN")

        # commit and push only the mock, its specs and the Dockerfile
        git("add", "--", d["mock"], "Dockerfile", d["research"], d["design"])
        git("commit", "-m", f"{d['mock']}: {d['company']} × Fawtara e-invoicing walkthrough\n\n"
                            f"Built by the mock-builder MCP server (job {job.id}) with Claude Code,\n"
                            f"following agent-skills. verify.py: CLEAN.\n\n"
                            f"Co-Authored-By: Claude <noreply@anthropic.com>")
        git("pull", "--rebase", "origin", s.git_branch, timeout=600)
        git("push", "origin", f"HEAD:{s.git_branch}", timeout=600)
        d["commit"] = git("rev-parse", "HEAD")
        job.set_state("awaiting_deploy",
                      f"Pushed {d['commit'][:8]} to {s.git_branch} — waiting for a human to approve 'deploy'.")


def _deploy(job: Job) -> None:
    s = config.get()
    d = job.data
    result = jarvis.deploy(job.log, d.get("commit"))
    deployed = result.get("commit", "")
    if deployed and deployed != "HEAD" and d.get("commit"):
        with _repo_lock:
            git("fetch", "origin", s.git_branch)
            ok = subprocess.run(["git", "merge-base", "--is-ancestor", d["commit"], deployed],
                                cwd=s.repo_dir).returncode == 0
        if not ok:
            raise RuntimeError(f"deployed commit {deployed[:8]} does not contain {d['commit'][:8]}")
    d["live_url"] = f"{s.public_base}/{d['mock']}/"
    d["live_check"] = live_check(d["live_url"], d["company"])
    job.set_state("done", f"Live at {d['live_url']} — page check: {d['live_check']}")


# ---------------------------------------------------------------- public API
def start(company: str, slug: str | None, notes: str | None, rebuild: bool) -> Job:
    company = company.strip()
    if not company:
        raise ValueError("company is required")
    slug = (slug or make_slug(company)).strip().lower()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,40}", slug):
        raise ValueError("slug must be lowercase letters, digits and hyphens")
    with _lock:
        cur = open_job()
        if cur:
            raise RuntimeError(f"job {cur.id} ({cur.data['company']}) is still open in state "
                               f"'{cur.data['state']}'. Finish or cancel it first.")
        mock = f"{slug}-mock"
        s = config.get()
        ensure_repo()
        git("fetch", "origin", s.git_branch)
        exists = git("ls-tree", "--name-only", f"origin/{s.git_branch}", mock + "/", check=False)
        if exists and not rebuild:
            raise RuntimeError(f"{mock}/ already exists on {s.git_branch}. Pass rebuild=true to rebuild it, "
                               f"or choose another slug.")
        date = today()
        job = Job({
            "id": uuid.uuid4().hex[:10], "company": company, "slug": slug, "mock": mock,
            "date": date, "notes": notes or "", "rebuild": bool(rebuild),
            "research": f"docs/specs/{date}-{slug}-research.md",
            "design": f"docs/specs/{date}-{slug}-mock-design.md",
            "state": "researching", "created": now(), "updated": now(),
        })
        job.save()
    job.log(f"Job created for {company} (slug {slug})")
    _phase(job, _research_design)
    return job


def approve(job_id: str, decision: str, notes: str | None) -> Job:
    decision = decision.strip().lower()
    with _lock:
        job = load(job_id)
        st = job.data["state"]
        if decision == "go":
            if st not in ("awaiting_go", "build_failed"):
                raise RuntimeError(f"'go' is only accepted when awaiting_go or build_failed (now '{st}')")
            job.data["go_notes"] = notes or job.data.get("go_notes", "")
            job.data.pop("error", None)
            job.set_state("building", "Approved 'go' — building.")
            _phase(job, _build)
        elif decision == "deploy":
            if st != "awaiting_deploy":
                raise RuntimeError(f"'deploy' is only accepted when awaiting_deploy (now '{st}')")
            job.data.pop("error", None)
            job.set_state("deploying", "Approved 'deploy' — deploying via jarvis-fleet.")
            _phase(job, _deploy)
        else:
            raise ValueError("decision must be 'go' or 'deploy'")
    return job


def cancel(job_id: str) -> Job:
    with _lock:
        job = load(job_id)
        st = job.data["state"]
        if st in BUSY_STATES:
            raise RuntimeError(f"job is busy ({st}); wait for it to stop before cancelling")
        if st not in OPEN_STATES:
            raise RuntimeError(f"job is already {st}")
        if st == "awaiting_deploy":
            job.set_state("cancelled", "Cancelled after push — the mock is on main but was not deployed.")
        else:
            with _repo_lock:
                reset_repo()
            job.set_state("cancelled", "Cancelled; local changes discarded.")
    return job


def status(job: Job) -> dict:
    d = dict(job.data)
    nxt = {
        "researching": "Wait — researching and writing the design spec.",
        "awaiting_go": "Read get_design, then approve(job_id, 'go', notes) or cancel.",
        "building": "Wait — building and verifying the mock.",
        "build_failed": "Read the error. approve(job_id, 'go', notes) retries the build, or cancel.",
        "awaiting_deploy": "Check the mock, then approve(job_id, 'deploy').",
        "deploying": "Wait — deploying through jarvis-fleet.",
        "done": "Finished.", "failed": "Failed — start a new job.", "cancelled": "Cancelled.",
    }
    d["next_step"] = nxt.get(d["state"], "")
    d["events"] = job.tail("events.log", 15)
    d["progress"] = job.tail("progress.log", 12)
    return d


def list_mocks() -> list[dict]:
    s = config.get()
    with _repo_lock:
        ensure_repo()
        git("fetch", "origin", s.git_branch)
        names = git("ls-tree", "--name-only", "-d", f"origin/{s.git_branch}").splitlines()
    return [{"mock": n, "url": f"{s.public_base}/{n}/"} for n in names if n.endswith("-mock")]


def remove_job_dir(job_id: str) -> None:  # used by tests only
    shutil.rmtree(config.get().jobs_dir / job_id, ignore_errors=True)
