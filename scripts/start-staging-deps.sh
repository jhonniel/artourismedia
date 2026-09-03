#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Starting staging dependencies (PostgreSQL, Redis, Mailpit)..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d

echo
echo "Staging services:"
echo "  PostgreSQL  localhost:5432  destination_studio / destination_user / secret"
echo "  Redis       localhost:6379"
echo "  Mailpit UI  http://localhost:8025"
echo
echo "Next steps:"
echo "  cp backend/.env.staging.example backend/.env"
echo "  cd backend && composer install && php artisan key:generate && php artisan migrate --seed"
