================================================================================
  DEPLOY — artourismedia.com
================================================================================

WHICH ZIP? (read this first)
----------------------------

  web-deploy.zip   ← USE THIS (website + admin + API, ~1.5 MB)
  static-web.zip   ← UI-only update (~3.5 MB) when /api/health already works

  You only deploy ONE zip per update — never both.


BUILD ON PC
-----------

  npm run build:deploy

  Output:
    dist/web-deploy.zip   full Laravel app + built UI
    dist/static-web.zip   backend/public only (no app/, routes/, vendor/)


  PC                          SERVER
  ---                         ------
  npm run build:deploy   →    upload dist/web-deploy.zip
                              unzip to /var/www/artourismedia.com
                              cp .env.production.example .env
                              SEED=1 bash scripts/server-after-unzip.sh   (first time)
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
      favicon.png                ← bundled with deploy


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
  php artisan mindanao-connect:import-videos   # if Mindanao CONNECT changed
  php artisan cache:clear
  php artisan config:cache

  From PC after branding/image changes:
    npm run assets:upload

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
  API 500 permission?     sudo chown -R www-data:www-data .
  Check all:              php artisan deploy:check
  Test API:               curl https://artourismedia.com/api/health

  Missing images on live site?
    → Most images load from DigitalOcean Spaces, not the zip.
    → From PC: npm run assets:upload

  Mindanao CONNECT videos missing?
    → curl https://artourismedia.com/api/services/mindanao-connect
    → Response must include "videos": [...] (not just title/description).
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


IMAGES & FAVICONS
-----------------

  Hero, about, and slideshow images are served from DigitalOcean Spaces.
  Brand logo, service icons, and favicon.png are bundled in web-deploy.zip.
  Upload or refresh CDN assets from PC: npm run assets:upload

================================================================================
