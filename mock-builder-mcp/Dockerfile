# mock-builder MCP server — builds erp_hub_mock mocks with Claude Code.
FROM node:22-bookworm-slim

# git for the repo, Python for the server and verify.py
RUN apt-get update && apt-get install -y --no-install-recommends \
      git ca-certificates python3 python3-venv tini \
    && rm -rf /var/lib/apt/lists/*

# Claude Code CLI (headless). Pin a version you have tested.
ARG CLAUDE_CODE_VERSION=latest
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} && npm cache clean --force

# Python deps in a venv; Chromium for verify.py's browser checks
ENV VIRTUAL_ENV=/opt/venv PATH=/opt/venv/bin:$PATH PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
COPY requirements.txt /srv/requirements.txt
RUN python3 -m venv /opt/venv \
    && pip install --no-cache-dir -r /srv/requirements.txt \
    && playwright install --with-deps chromium \
    && chmod -R a+rx /opt/pw-browsers

# Claude Code refuses to skip permission prompts as root, so run as a normal user.
RUN useradd -m -u 10001 builder && mkdir -p /data && chown builder:builder /data
COPY --chown=builder:builder app /srv/app
COPY --chown=builder:builder entrypoint.sh /srv/entrypoint.sh
WORKDIR /srv
USER builder

ENV DATA_DIR=/data PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s CMD python3 -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:8000/health',timeout=4)"
ENTRYPOINT ["tini", "--", "/srv/entrypoint.sh"]
