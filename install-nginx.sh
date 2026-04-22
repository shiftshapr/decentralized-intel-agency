#!/usr/bin/env bash
# Enable site in nginx (run with sudo).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/nginx/decentralizedintel.agency.conf"
DEST="/etc/nginx/sites-available/decentralizedintel.agency.conf"
DEST_EN="/etc/nginx/sites-enabled/decentralizedintel.agency.conf"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run: sudo $0"
  exit 1
fi

install -m 0644 "$SRC" "$DEST"
ln -sf "$DEST" "$DEST_EN"
nginx -t
systemctl reload nginx
echo "OK: https://decentralizedintel.agency/ — public/ + API on 4013 (enable decentralized-intel-site.service)"
echo "TLS: sudo certbot --nginx -d decentralizedintel.agency -d www.decentralizedintel.agency"
