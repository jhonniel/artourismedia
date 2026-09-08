================================================================================
  DEPLOY — artourismedia.com
================================================================================

WHICH ZIP? (read this first)
----------------------------

  web-deploy.zip   ← USE THIS (website + admin + API)
  static-web.zip   ← DO NOT use for first deploy (UI only, no API)

  You only deploy ONE zip — never both.


  PC                          SERVER
  ---                         ------
  npm run build:deploy   →    upload dist/web-deploy.zip
                              unzip to /var/www/artourismedia.com
                              cp .env.production.example .env
                              SEED=1 bash scripts/server-after-unzip.sh
                              Nginx root → .../public


AFTER UNZIP — FOLDER LOOKS LIKE THIS
------------------------------------

  /var/www/artourismedia.com/
    app/ routes/ artisan ...     ← Laravel (API)
    .env.production.example      ← copy to .env
    scripts/server-after-unzip.sh
    public/                      ← NGINX POINTS HERE
      index.php                  ← ONLY entry point (nginx + Apache)
      index.html                 ← built website (Laravel serves this)
      admin/index.html           ← built admin (Laravel serves this)


FIRST DEPLOY
------------

  cd /var/www/artourismedia.com
  unzip -o /path/to/web-deploy.zip
  cp .env.production.example .env
  nano .env
    # APP_KEY, DB_PASSWORD, ADMIN_PASSWORD, DIGITALOCEAN_SPACES_KEY/SECRET

  SEED=1 bash scripts/server-after-unzip.sh

  Nginx: root /var/www/artourismedia.com/public;
  Template: deploy/nginx/single-domain.conf
  (One entry point: index.php — reload nginx after updating the config)


UPDATES (site already live)
---------------------------

  cd /var/www/artourismedia.com
  unzip -o /path/to/web-deploy.zip
  composer install --no-dev --optimize-autoloader
  php artisan migrate --force
  php artisan mindanao-connect:import-videos
  php artisan cache:clear
  php artisan config:cache

  Cron (required for auto YouTube sync):
    * * * * * cd /var/www/artourismedia.com && php artisan schedule:run >> /dev/null 2>&1


TROUBLESHOOTING
---------------

  /api/* returns 404 "File not found"?
    → Laravel is not wired up. Check BOTH:

    1) index.php must exist on the server:
         ls -la /var/www/artourismedia.com/public/index.php

       If missing, you uploaded UI-only (static-web.zip) or unzipped wrong.
       Fix: upload web-deploy.zip and unzip the FULL app (app/, routes/, public/index.php).

    2) Nginx root must be the public/ folder:
         root /var/www/artourismedia.com/public;

       Test: curl -I https://artourismedia.com/index.php
       (should NOT say "File not found")

    3) Reload nginx after config change:
         sudo nginx -t && sudo systemctl reload nginx

  Blank landing page?     php artisan cache:clear
  First load OK, refresh blank?
    → index.html and /assets/* are out of sync (partial deploy or browser cache).
    → Run: php artisan deploy:check
    → Fix: unzip the FULL web-deploy.zip again (not just index.html).
    → Then: php artisan cache:clear
    → Reload nginx if you updated deploy/nginx/single-domain.conf
  API 500 permission?     sudo chown -R www-data:www-data .
  Check all:              php artisan deploy:check
  Test API:               curl https://artourismedia.com/api/health

  Mindanao CONNECT videos missing?
    → curl https://artourismedia.com/api/services/mindanao-connect
    → Response must include "videos": [...] (not just title/description).
    → If missing: you deployed static-web.zip only, or skipped migrate/import.
    → Fix: deploy web-deploy.zip, then:
         php artisan migrate --force
         php artisan mindanao-connect:import-videos
         php artisan cache:clear

  Consultation emails not sending?
    → In .env set:
         MAIL_MAILER=resend
         RESEND_API_KEY=your_resend_api_key
         MAIL_FROM_ADDRESS=atm@artourismedia.com
         MAIL_ADMIN_ADDRESS=atm@artourismedia.com
    → Verify artourismedia.com domain in Resend dashboard.
    → php artisan config:clear && php artisan cache:clear


IMAGES
------

  Not in zip — served from DigitalOcean Spaces.
  Upload from PC: npm run assets:upload

================================================================================
