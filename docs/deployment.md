# Production Deployment Guide

This guide covers deploying the Destination Studio CMS monorepo to a production server.

## Quick Start (repo tooling)

| Tool | Purpose |
|------|---------|
| `docker compose up -d` | Local PostgreSQL, Redis, and Mailpit for staging |
| `backend/.env.staging.example` | Staging env template wired to Docker services |
| `backend/.env.production.example` | Production env template |
| `npm run build:production` | Build frontend + admin with `VITE_API_URL` |
| `deploy/nginx/*.conf` | Nginx templates for API, frontend, and admin |
| `php artisan deploy:check` | Pre-flight validation before go-live |

### Staging with Docker

```bash
docker compose up -d
cp backend/.env.staging.example backend/.env
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Open Mailpit at `http://localhost:8025` to inspect outbound email during staging.

### Production asset build

```bash
VITE_API_URL=https://api.example.com/api npm run build:production
```

Deploy `frontend/dist` and `admin/dist` to your static hosts (see Nginx templates below).

## Architecture Overview

| Component | Stack | Suggested path |
|-----------|-------|----------------|
| Public site | React (Vite build) | `https://example.com` |
| Admin panel | Vue (Vite build) | `https://admin.example.com` |
| API | Laravel 13 | `https://api.example.com` |

All three apps share the same Laravel backend API.

## Server Requirements

- Ubuntu 22.04+ or similar Linux distribution
- Nginx 1.18+
- PHP 8.2+ with FPM (`pdo_pgsql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `fileinfo`, `gd`, `redis` optional)
- PostgreSQL 14+
- Node.js 20+ (build machine only)
- Composer 2.x
- SSL certificates (Let's Encrypt recommended)

## 1. Backend (Laravel API)

### Clone and install

```bash
cd /var/www/destination-studio/backend
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

### Environment (`.env`)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.example.com

FRONTEND_URL=https://example.com
ADMIN_URL=https://admin.example.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=destination_studio
DB_USERNAME=destination_user
DB_PASSWORD=your_secure_password

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

SANCTUM_STATEFUL_DOMAINS=example.com,admin.example.com
SESSION_DOMAIN=.example.com

# File storage (DigitalOcean Spaces example)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=sgp1
AWS_BUCKET=destination-studio
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=https://destination-studio.sgp1.digitaloceanspaces.com
```

### Database and optimization

```bash
php artisan migrate --force
php artisan db:seed --force   # first deploy only
php artisan deploy:check      # validate env, DB, storage before go-live
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

### Queue worker (systemd example)

```ini
[Unit]
Description=Destination Studio Queue Worker
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/destination-studio/backend
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always

[Install]
WantedBy=multi-user.target
```

## 2. Nginx Configuration

Ready-made templates are in `deploy/nginx/`:

- `api.conf` — Laravel API
- `frontend.conf` — React public site
- `admin.conf` — Vue admin panel

Copy and adjust domain names, SSL paths, and PHP-FPM socket for your server.

### API (`api.example.com`)

```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;
    root /var/www/destination-studio/backend/public;
    index index.php;

    ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Public frontend (`example.com`)

Build locally or on the server:

```bash
cd frontend
npm ci
VITE_API_URL=https://api.example.com/api npm run build
```

Deploy the `frontend/dist` folder:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    root /var/www/destination-studio/frontend/dist;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location /api {
        proxy_pass https://api.example.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Admin panel (`admin.example.com`)

```bash
cd admin
npm ci
VITE_API_URL=https://api.example.com/api npm run build
```

```nginx
server {
    listen 443 ssl http2;
    server_name admin.example.com;
    root /var/www/destination-studio/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 3. CORS and Sanctum

Ensure `config/cors.php` allows your frontend and admin origins. Sanctum cookie auth requires matching domains in `SANCTUM_STATEFUL_DOMAINS`.

For token-based admin auth (current setup), set the admin Axios base URL to the API domain and store the Bearer token after login.

## 4. Cache Invalidation

The API automatically clears public caches (`api.site`, `api.homepage`, `sitemap.urls`) when CMS content is created, updated, or deleted. With Redis as `CACHE_STORE`, ensure Redis is running and reachable.

## 5. Scheduled Tasks

Add to crontab for the `www-data` user:

```cron
* * * * * cd /var/www/destination-studio/backend && php artisan schedule:run >> /dev/null 2>&1
```

## 6. Post-Deploy Checklist

- [ ] Run `php artisan deploy:check` — all checks pass (includes Redis when configured, mail config, weak password guard in production)
- [ ] Verify `GET /api/health` returns `"status": "ok"`
- [ ] Change default admin password (`admin@destinationstudio.test`)
- [ ] Upload logo and favicon via **Settings → Appearance**
- [ ] Configure Google Analytics ID if needed
- [ ] Verify `/api/sitemap.xml` returns URLs
- [ ] Test contact form and newsletter subscription
- [ ] Run Lighthouse audit on the homepage
- [ ] Enable automated backups for PostgreSQL and media storage

## 7. Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `APP_URL` | Public API base URL |
| `FRONTEND_URL` | Used for post preview links |
| `ADMIN_URL` | Optional admin origin for CORS |
| `VITE_API_URL` | Frontend/admin build-time API URL |

## Troubleshooting

**502 Bad Gateway** — Check PHP-FPM is running: `systemctl status php8.2-fpm`

**CORS errors** — Verify `config/cors.php` paths and allowed origins match your domains.

**Stale homepage content** — Confirm Redis/cache driver is configured; CMS saves trigger automatic cache flush.

**Media uploads fail** — Check S3/Spaces credentials and bucket permissions; ensure `FILESYSTEM_DISK` matches your provider.
