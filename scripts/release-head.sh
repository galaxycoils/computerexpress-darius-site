#!/usr/bin/env bash
set -euo pipefail
if ! [[ "${RELEASE_SHA:-}" =~ ^[0-9a-f]{40}$ ]]; then
  echo '::error::An exact release revision is required.'
  exit 1
fi
git fetch origin main
latest=$(git rev-parse FETCH_HEAD)
if [ "$latest" = "$RELEASE_SHA" ]; then
  echo 'publish=true' >> "$GITHUB_OUTPUT"
else
  echo 'publish=false' >> "$GITHUB_OUTPUT"
  echo 'Publication skipped: a newer main revision superseded this release.' >> "$GITHUB_STEP_SUMMARY"
fi
