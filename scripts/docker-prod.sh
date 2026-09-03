#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.docker"
PROFILE="${DOCKER_PROFILE:-bundled-db}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.docker.example and edit it first:"
  echo "  cp .env.docker.example .env.docker"
  exit 1
fi

if ! grep -q '^APP_KEY=.\+' "$ENV_FILE" 2>/dev/null; then
  echo "Generating APP_KEY..."
  KEY="base64:$(openssl rand -base64 32)"
  if grep -q '^APP_KEY=' "$ENV_FILE"; then
    sed -i.bak "s|^APP_KEY=.*|APP_KEY=${KEY}|" "$ENV_FILE" && rm -f "${ENV_FILE}.bak"
  else
    echo "APP_KEY=${KEY}" >> "$ENV_FILE"
  fi
fi

CMD="${1:-up}"

case "$CMD" in
  up)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" up -d --build
    echo ""
    echo "Stack is starting."
    echo "  Website  http://localhost:${HTTP_PORT:-80}/"
    echo "  Admin    http://localhost:${HTTP_PORT:-80}/admin/"
    echo "  Health   http://localhost:${HTTP_PORT:-80}/api/health"
    ;;
  down)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" down
    ;;
  logs)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" logs -f "${2:-}"
    ;;
  migrate)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" exec app php artisan migrate --force
    ;;
  seed)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" exec app php artisan db:seed --force
    ;;
  check)
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile "$PROFILE" exec app php artisan deploy:check
    ;;
  *)
    echo "Usage: $0 {up|down|logs|migrate|seed|check}"
    exit 1
    ;;
esac
