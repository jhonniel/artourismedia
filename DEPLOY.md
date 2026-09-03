# Deployment Guide

How to deploy **Art Boncato Tourism Consultancy** (Destination Studio CMS) to production.

Everything runs on **one domain**:

| URL | App |
|-----|-----|
| `https://yourdomain.com/` | Public website (React) |
| `https://yourdomain.com/admin/` | Admin panel (Vue) |
| `https://yourdomain.com/api/` | Laravel API |

---

## Requirements

| Requirement | Version / notes |
|-------------|-----------------|
| **PHP** | **8.3+** (8.0 / 8.1 / 8.2 are not supported) |
| **Database** | PostgreSQL 14+ |
| **Cache / queues** | Redis (recommended in production) |
| **Node.js** | 20+ (build machine only — not needed at runtime with Docker) |
| **Media storage** | DigitalOcean Spaces (recommended) or local disk |

---

## Choose a deployment method

| Method | Best for | Difficulty |
|--------|----------|------------|
| **[A. Docker (recommended)](#a-docker-deployment-digitalocean)** | DigitalOcean Droplet, reproducible deploys | Easy |
| **[B. Nginx + PHP (no Docker)](#b-nginx--php-no-docker)** | Traditional VPS, full server control | Medium |

---

## A. Docker deployment (DigitalOcean)

Runs Nginx, PHP 8.3-FPM, Redis, queue worker, scheduler, and PostgreSQL (bundled or managed) via Docker Compose.

### Step 1 — Create DigitalOcean resources

1. **Droplet** — Ubuntu 24.04, **4 GB RAM** minimum
2. **Domain** — A record pointing to the Droplet IP
3. **Managed PostgreSQL** (recommended) *or* use bundled Postgres in Docker
4. **Space** — for media uploads (S3-compatible object storage)
5. **Spaces API keys** — under DigitalOcean → API → Spaces Keys

### Step 2 — Install Docker on the Droplet

SSH into the server:

```bash
ssh root@YOUR_DROPLET_IP

curl -fsSL https://get.docker.com | sh
apt install -y git
```

### Step 3 — Clone the project

```bash
git clone YOUR_REPO_URL /var/www/destination-studio
cd /var/www/destination-studio
```

### Step 4 — Configure environment

```bash
cp .env.docker.example .env.docker
nano .env.docker
```

**Minimum settings:**

```env
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

DB_PASSWORD=your-strong-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-strong-password

# DigitalOcean Spaces
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-spaces-key
AWS_SECRET_ACCESS_KEY=your-spaces-secret
AWS_DEFAULT_REGION=sgp1
AWS_BUCKET=your-bucket
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=https://your-bucket.sgp1.digitaloceanspaces.com
```

**Generate `APP_KEY`** (or let the deploy script create one):

```bash
docker run --rm php:8.3-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

Paste the output into `.env.docker` as `APP_KEY=base64:...`

### Step 5 — Start the stack

**With bundled PostgreSQL** (simplest — everything on one Droplet):

```bash
chmod +x scripts/docker-prod.sh
./scripts/docker-prod.sh up
```

**With DigitalOcean Managed PostgreSQL** (recommended for production):

Set in `.env.docker`:

```env
DB_HOST=your-cluster.db.ondigitalocean.com
DB_PORT=25060
DB_USERNAME=doadmin
DB_PASSWORD=your-managed-db-password
DB_SSLMODE=require
```

Add your Droplet IP under the database **Trusted sources**, then start without bundled Postgres:

```bash
DOCKER_PROFILE="" ./scripts/docker-prod.sh up
```

### Step 6 — First deploy (seed database)

```bash
./scripts/docker-prod.sh seed
```

Or set `RUN_SEED=true` in `.env.docker` before `./scripts/docker-prod.sh up`, then set it back to `false`.

### Step 7 — Verify

```bash
./scripts/docker-prod.sh check
curl http://localhost/api/health
```

Open in browser:

- `http://YOUR_DROPLET_IP/` — website
- `http://YOUR_DROPLET_IP/admin/` — admin login

### Step 8 — Enable HTTPS

Point DNS to the Droplet, then add SSL:

```bash
apt install -y certbot
docker compose -f docker-compose.prod.yml stop nginx
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Put a host Nginx reverse proxy in front of Docker port 80, or use a [DigitalOcean Load Balancer](https://docs.digitalocean.com/products/networking/load-balancers/) with managed SSL.

### Docker day-to-day commands

```bash
./scripts/docker-prod.sh up       # build + start
./scripts/docker-prod.sh down     # stop
./scripts/docker-prod.sh logs     # view logs
./scripts/docker-prod.sh migrate  # run migrations
./scripts/docker-prod.sh check    # pre-flight validation
```

### Docker updates (new code)

```bash
cd /var/www/destination-studio
git pull
./scripts/docker-prod.sh up
./scripts/docker-prod.sh migrate
```

### Docker files reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (Node + Composer + PHP + Nginx) |
| `docker-compose.prod.yml` | Production stack |
| `.env.docker.example` | Environment template |
| `scripts/docker-prod.sh` | Deploy helper script |
| `deploy/docker/nginx.conf` | Nginx config inside container |

More detail: [docs/deployment-docker.md](docs/deployment-docker.md)

---

## B. Nginx + PHP (no Docker)

Deploy on a Linux server with Nginx, PHP 8.3-FPM, PostgreSQL, and Redis installed directly on the host.

### Step 1 — Install server packages (Ubuntu)

```bash
sudo apt update
sudo apt install -y nginx postgresql redis-server \
  php8.3-fpm php8.3-pgsql php8.3-mbstring php8.3-xml php8.3-curl \
  php8.3-zip php8.3-gd php8.3-redis php8.3-intl \
  composer git certbot python3-certbot-nginx nodejs npm
```

### Step 2 — Clone and configure

```bash
sudo git clone YOUR_REPO_URL /var/www/destination-studio
cd /var/www/destination-studio/backend

cp .env.single-domain.example .env
nano .env
```

Key `.env` values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=destination_studio
DB_USERNAME=destination_user
DB_PASSWORD=your-strong-password

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1

# DigitalOcean Spaces
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=sgp1
AWS_BUCKET=your-bucket
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_URL=https://your-bucket.sgp1.digitaloceanspaces.com

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-strong-password
```

### Step 3 — Install backend + build frontend

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force    # first deploy only
php artisan storage:link

cd ..
npm run build                  # builds site + admin into backend/public/
```

`npm run build` does three things:

1. Builds the React public site
2. Builds the Vue admin panel (served at `/admin/`)
3. Copies both into `backend/public/`

### Step 4 — Optimize Laravel

```bash
cd backend
php artisan deploy:check
php artisan config:cache
php artisan route:cache
php artisan view:cache

sudo chown -R www-data:www-data storage bootstrap/cache
```

### Step 5 — Configure Nginx

```bash
sudo cp deploy/nginx/single-domain.conf /etc/nginx/sites-available/destination-studio.conf
sudo nano /etc/nginx/sites-available/destination-studio.conf
# Replace yourdomain.com and confirm root path:
# root /var/www/destination-studio/backend/public;

sudo ln -sf /etc/nginx/sites-available/destination-studio.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 6 — Queue worker + cron

Create `/etc/systemd/system/destination-studio-queue.service`:

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

Enable it:

```bash
sudo systemctl enable --now destination-studio-queue
```

Add cron for scheduled tasks:

```bash
sudo crontab -u www-data -e
```

```cron
* * * * * cd /var/www/destination-studio/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Nginx updates (new code)

```bash
cd /var/www/destination-studio
git pull
cd backend && composer install --no-dev --optimize-autoloader && php artisan migrate --force
cd .. && npm run build
cd backend && php artisan config:cache && php artisan route:cache
sudo systemctl reload nginx
```

More detail: [docs/deployment-single-domain.md](docs/deployment-single-domain.md)

---

## DigitalOcean Spaces setup

Media uploads (admin library, images) use S3-compatible storage.

1. **Create a Space** — DigitalOcean → Spaces → Create (e.g. region `sgp1`)
2. Set the Space to **Public**, or use the CDN URL as `AWS_URL`
3. Create **Spaces Keys** — API → Spaces Keys
4. Add credentials to `.env.docker` or `backend/.env`

Test after deploy:

```bash
# Docker
./scripts/docker-prod.sh check

# No Docker
cd backend && php artisan deploy:check
```

The deploy check validates S3 credentials when `FILESYSTEM_DISK=s3`.

---

## Post-deploy checklist

- [ ] `GET /api/health` returns `"status": "ok"`
- [ ] Homepage loads on desktop and mobile
- [ ] Admin login works at `/admin/`
- [ ] **Change default admin password** (if seeded: `admin@destinationstudio.test` / `password`)
- [ ] Contact form sends email (configure SMTP — not `log` driver)
- [ ] Media upload works in admin (Spaces credentials)
- [ ] `/api/sitemap.xml` returns URLs
- [ ] HTTPS enabled and HTTP redirects to HTTPS
- [ ] Database backups enabled (Managed DB or Droplet snapshots)
- [ ] Set `RUN_SEED=false` after first Docker deploy

---

## Test production locally (before deploying)

Build and run everything on one port:

```bash
npm run build
npm run start
```

Open:

- Website: http://localhost:8000/
- Admin: http://localhost:8000/admin/
- API: http://localhost:8000/api/health

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **502 Bad Gateway** | Check PHP-FPM / Docker app logs: `docker compose -f docker-compose.prod.yml logs app` |
| **Database connection failed** | Verify `DB_HOST`, credentials, trusted sources (Managed PG), `DB_SSLMODE=require` |
| **CORS / login issues** | Match `SANCTUM_STATEFUL_DOMAINS` and `SESSION_DOMAIN` to your domain |
| **Uploads fail** | Check Spaces `AWS_*` vars; bucket must be public or use CDN URL |
| **Stale content** | `php artisan config:cache` and restart queue/cache |
| **Docker build OOM** | Use a 4 GB+ Droplet or build images locally and push to a registry |
| **PHP version error** | Must be **8.3+** — run `php -v` on the server |

**Health endpoint (monitoring):**

```
GET https://yourdomain.com/api/health
```

---

## Related documentation

- [Docker deployment (detailed)](docs/deployment-docker.md)
- [Single-domain deployment (detailed)](docs/deployment-single-domain.md)
- [Multi-subdomain deployment](docs/deployment.md)
- [Local setup](docs/setup.md)
