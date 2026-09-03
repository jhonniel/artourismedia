#!/bin/sh
set -e

cd /var/www/html

wait_for_database() {
  if [ -z "$DB_HOST" ]; then
    return 0
  fi

  echo "Waiting for database at ${DB_HOST}:${DB_PORT:-5432}..."

  i=0
  while [ "$i" -lt 60 ]; do
    if php artisan db:show --database=pgsql >/dev/null 2>&1; then
      echo "Database is ready."
      return 0
    fi

    i=$((i + 1))
    sleep 2
  done

  echo "Database connection timed out."
  return 1
}

mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

wait_for_database

php artisan storage:link --force >/dev/null 2>&1 || true

if [ "$RUN_MIGRATIONS" = "true" ]; then
  php artisan migrate --force
fi

if [ "$RUN_SEED" = "true" ]; then
  php artisan db:seed --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"
