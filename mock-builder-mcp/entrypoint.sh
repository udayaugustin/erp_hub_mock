#!/bin/sh
# Startup: git identity + token-based push credentials (the token stays in the
# environment, never in a file), then the MCP server.
set -e
git config --global user.name  "${GIT_AUTHOR_NAME:-mock-builder}"
git config --global user.email "${GIT_AUTHOR_EMAIL:-mock-builder@users.noreply.github.com}"
if [ -n "$GITHUB_TOKEN" ]; then
  git config --global credential.helper \
    '!f() { echo username=x-access-token; echo "password=$GITHUB_TOKEN"; }; f'
fi
mkdir -p "${DATA_DIR:-/data}"
exec python3 -m app.server
