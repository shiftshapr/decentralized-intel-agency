#!/usr/bin/env bash
# Prepare decentralizedintel.agency static + API stack (no sudo required).
#   bash /home/ubuntu/decentralizedintel-agency/deploy/scripts/deploy-www.sh
set -euo pipefail

REPO="${DEPLOY_PATH:-/home/ubuntu/decentralizedintel-agency}"
PUBLIC="$REPO/public"
ASSETS="$REPO/assets"

cd "$REPO"

echo "==> npm install (production deps)"
npm install --omit=dev

echo "==> assets symlink public/assets -> ../assets"
mkdir -p "$PUBLIC"
if [[ ! -e "$PUBLIC/assets" ]]; then
  ln -sfn ../assets "$PUBLIC/assets"
fi

if [[ ! -f "$PUBLIC/index.html" ]]; then
  echo "error: missing $PUBLIC/index.html" >&2
  exit 1
fi

if [[ ! -f "$ASSETS/DIA.webp" ]]; then
  echo "warning: missing $ASSETS/DIA.webp (WebP art)" >&2
fi

echo "deploy complete: decentralizedintel.agency (static in $PUBLIC, API on :4013)"
echo "next: sudo systemctl restart decentralized-intel-site.service (if API code changed)"
