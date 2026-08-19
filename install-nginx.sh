#!/usr/bin/env bash
# Deprecated — use deploy/scripts/apply-nginx-and-tls.sh
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec bash "$SCRIPT_DIR/deploy/scripts/apply-nginx-and-tls.sh" "$@"
