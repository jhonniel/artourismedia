SERVER DEPLOY — https://artourismedia.com
(No Docker — backend/.env only)
=========================================

WHAT TO UPLOAD
--------------

  web-deploy.zip     FULL dynamic app (use this for first deploy)
                     Laravel API + website + admin (no bundled images)

  static-web.zip     UI-only update (optional, after first deploy)


DATABASE (PostgreSQL on server)
-------------------------------

  Production uses PostgreSQL — NOT SQLite.

  In .env (copy from .env.production):

    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=destination_studio
    DB_USERNAME=destination_user
    DB_PASSWORD=your_password

  Requires PHP extension: pdo_pgsql
  Check: php -m | grep pgsql


IMAGES (DigitalOcean Spaces)
----------------------------

  Site images are NOT in the zip. They are served from Spaces:

    https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static/

  Set in .env:
    ASSETS_BASE_URL=https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static
    DIGITALOCEAN_SPACES_KEY / SECRET (admin uploads + static assets)

  To upload or refresh static images from your PC:

    npm run assets:upload


FIRST-TIME SETUP (on server)
----------------------------

  unzip web-deploy.zip -d /var/www/art-website/backend
  cd /var/www/art-website/backend

  cp .env.production .env
  nano .env
    # Set: APP_KEY, DB_PASSWORD, ADMIN_PASSWORD, DIGITALOCEAN_SPACES_KEY/SECRET

  composer install --no-dev --optimize-autoloader
  php artisan key:generate          # only if APP_KEY is empty
  php artisan migrate --force
  php artisan db:seed --force         # first deploy only
  php artisan storage:link
  php artisan config:cache
  php artisan route:cache

  # Nginx root: /var/www/art-website/backend/public
  # See deploy/nginx/single-domain.conf


URLS
----

  https://artourismedia.com/         Website (loads data from API)
  https://artourismedia.com/admin/   Admin
  https://artourismedia.com/api/     Laravel API (dynamic)

  Admin: admin@artourismedia.com / ADMIN_PASSWORD in .env


WHY TWO ZIP FILES?
------------------

  web-deploy.zip   Dynamic — includes Laravel (PHP) so /api/ works (~3 MB, no images)
  static-web.zip   Static UI only — use when you change design/code
                   but API is already on the server


HOW TO UPDATE
-------------

  Content          → /admin/ (no redeploy)
  UI only          → upload static-web.zip → extract to public/
  API + UI         → upload new web-deploy.zip
  New site images  → npm run assets:upload (from dev machine)


Build on your PC:

  npm run build:deploy

See also: README.md and DEPLOY.md in the repo root.
