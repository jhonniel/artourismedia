#!/usr/bin/env bash
# Run from Laravel root AFTER unzipping web-deploy.zip (where artisan lives).
# Usage: bash scripts/server-after-unzip.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Laravel root: $ROOT"

if [[ ! -f artisan ]]; then
  echo "ERROR: artisan not found. Unzip web-deploy.zip so app/, public/, artisan are in this folder."
  exit 1
fi

if [[ ! -f .env ]]; then
  if [[ -f .env.production.example ]]; then
    cp .env.production.example .env
    echo "Created .env from .env.production.example — edit it before continuing if you have not already."
  else
    echo "ERROR: Missing .env. Copy .env.production.example to .env and set secrets."
    exit 1
  fi
fi

echo "==> composer install"
composer install --no-dev --optimize-autoloader

if grep -q '^APP_KEY=$' .env || grep -q '^APP_KEY=\s*$' .env; then
  echo "==> php artisan key:generate"
  php artisan key:generate --force
fi

echo "==> php artisan migrate"
php artisan migrate --force

echo "==> php artisan mindanao-connect:import-videos"
php artisan mindanao-connect:import-videos || echo "WARN: Mindanao video import failed — run manually after checking server can reach youtube.com"

if [[ "${SEED:-}" == "1" ]]; then
  echo "==> php artisan db:seed"
  php artisan db:seed --force
fi

echo "==> php artisan storage:link (if needed)"
php artisan storage:link 2>/dev/null || true

echo "==> php artisan cache:clear"
php artisan cache:clear

echo "==> php artisan config:cache && route:cache"
php artisan config:cache
php artisan route:cache

WEB_USER="${WEB_USER:-www-data}"
if id "$WEB_USER" &>/dev/null; then
  echo "==> Fix permissions for $WEB_USER"
  chown -R "$WEB_USER:$WEB_USER" storage bootstrap/cache 2>/dev/null || \
    sudo chown -R "$WEB_USER:$WEB_USER" storage bootstrap/cache
  chmod -R 775 storage bootstrap/cache 2>/dev/null || \
    sudo chmod -R 775 storage bootstrap/cache
fi

echo ""
echo "==> deploy:check"
php artisan deploy:check || true

echo ""
echo "Done."
echo "Nginx document root must be: $ROOT/public"
echo "First deploy? Run: SEED=1 bash scripts/server-after-unzip.sh"
echo "Test: curl -s \$(grep '^APP_URL=' .env | cut -d= -f2- | tr -d '\"')/api/health"
