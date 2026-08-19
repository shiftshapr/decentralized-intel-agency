#!/usr/bin/env bash
# Apply decentralizedintel.agency nginx vhost + Let's Encrypt cert. Requires root.
#   sudo bash /home/ubuntu/decentralizedintel-agency/deploy/scripts/apply-nginx-and-tls.sh
#
# Prerequisite: Cloudflare DNS A for decentralizedintel.agency + www → 216.238.91.120
# (grey cloud / DNS only for certbot HTTP-01).
set -euo pipefail

REPO="${DEPLOY_PATH:-/home/ubuntu/decentralizedintel-agency}"
CONF_HTTP="$REPO/deploy/nginx/decentralizedintel.agency.http-only.conf"
CONF_FULL="$REPO/deploy/nginx/decentralizedintel.agency.conf"
CONF_DST="/etc/nginx/sites-available/decentralizedintel.agency.conf"
CERT_DIR="/etc/letsencrypt/live/decentralizedintel.agency"
EMAIL="${CERTBOT_EMAIL:-daveed@bridgit.io}"
UNIT="decentralized-intel-site.service"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "error: run with sudo" >&2
  exit 1
fi

echo "==> deploy static + npm deps"
sudo -u ubuntu bash "$REPO/deploy/scripts/deploy-www.sh"

echo "==> enable API service ($UNIT)"
systemctl enable "$UNIT"
systemctl restart "$UNIT"
sleep 1
if ! systemctl is-active --quiet "$UNIT"; then
  echo "error: $UNIT failed to start" >&2
  systemctl status "$UNIT" --no-pager || true
  exit 1
fi

echo "==> install HTTP vhost"
install -m 0644 "$CONF_HTTP" "$CONF_DST"
ln -sf "$CONF_DST" /etc/nginx/sites-enabled/decentralizedintel.agency.conf
nginx -t
systemctl reload nginx

if [[ ! -f "$CERT_DIR/fullchain.pem" ]]; then
  echo "==> certbot (webroot) decentralizedintel.agency + www.decentralizedintel.agency"
  certbot certonly --webroot -w /var/www/html \
    --cert-name decentralizedintel.agency \
    -d decentralizedintel.agency -d www.decentralizedintel.agency \
    --non-interactive --agree-tos -m "$EMAIL"
fi

echo "==> install HTTPS vhost"
install -m 0644 "$CONF_FULL" "$CONF_DST"
nginx -t
systemctl reload nginx

echo "==> verify"
curl -sfI "http://216.238.91.120/" -H 'Host: decentralizedintel.agency' | head -5
curl -sf "http://127.0.0.1:4013/api/health" | head -c 120 || true
echo
curl -sfI "https://decentralizedintel.agency/" | head -5 || echo "(HTTPS check skipped if DNS not on this host)"
echo "done: decentralizedintel.agency -> $REPO/public + API :4013"
