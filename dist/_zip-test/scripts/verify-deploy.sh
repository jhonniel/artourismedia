#!/usr/bin/env bash
# Quick checks after deploy — run on the server from Laravel root.
# Usage: bash scripts/verify-deploy.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PUBLIC="$ROOT/public"
FAIL=0

check() {
  if eval "$2"; then
    echo "OK  $1"
  else
    echo "FAIL $1"
    FAIL=1
  fi
}

echo "Laravel root: $ROOT"
echo ""

check "artisan exists" "[[ -f artisan ]]"
check "public/index.php exists" "[[ -f public/index.php ]]"
check "public/index.html exists" "[[ -f public/index.html ]]"
check "public/admin/index.html exists" "[[ -f public/admin/index.html ]]"
check "vendor/autoload.php exists" "[[ -f vendor/autoload.php ]]"
check ".env exists" "[[ -f .env ]]"

if [[ -f .env ]] && grep -q '^APP_KEY=$' .env 2>/dev/null; then
  echo "FAIL APP_KEY is empty in .env"
  FAIL=1
else
  echo "OK  APP_KEY set (or .env missing — fix separately)"
fi

echo ""
if [[ $FAIL -ne 0 ]]; then
  echo "Deploy incomplete — upload web-deploy.zip (full app), not static-web.zip alone."
  echo "Then: composer install && cp .env.production.example .env"
  exit 1
fi

echo "File checks passed. Test API (requires nginx + php-fpm running):"
echo "  curl -s https://artourismedia.com/api/health"
echo ""
echo "If API 404 'File not found', nginx root must be: $PUBLIC"
