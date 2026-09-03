# Docker Production Deployment (DigitalOcean)

Deploy the full stack with **Docker Compose**: Nginx, PHP-FPM (Laravel), Redis, queue worker, scheduler, and PostgreSQL (bundled or DigitalOcean Managed).

| URL | App |
|-----|-----|
| `https://yourdomain.com/` | Public website |
| `https://yourdomain.com/admin/` | Admin panel |
| `https://yourdomain.com/api/` | Laravel API |

---

## What gets built

The `Dockerfile` is multi-stage:

1. **Node** — builds React site + Vue admin, copies into `backend/public/`
2. **Composer** — installs PHP dependencies
3. **app** — PHP 8.3-FPM with Laravel
4. **web** — Nginx serving static assets + proxying PHP to `app`

Services in `docker-compose.prod.yml`:

| Service | Role |
|---------|------|
| `nginx` | Public HTTP entry (port 80) |
| `app` | Laravel PHP-FPM |
| `redis` | Cache, sessions, queues |
| `queue` | `php artisan queue:work` |
| `scheduler` | `php artisan schedule:work` |
| `postgres` | Optional bundled DB (`--profile bundled-db`) |

---

## Option A — DigitalOcean Droplet + bundled PostgreSQL

Best for a single Droplet with everything self-contained.

### 1. Create a Droplet

- **Ubuntu 24.04**
- **4 GB RAM** recommended (Docker build uses memory)
- Install Docker:

```bash
curl -fsSL https://get.docker.com | sh
apt install -y git
```

### 2. Clone and configure

```bash
git clone YOUR_REPO /var/www/destination-studio
cd /var/www/destination-studio

cp .env.docker.example .env.docker
nano .env.docker
```

Set at minimum:

```env
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

DB_PASSWORD=your-strong-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-strong-password

# DigitalOcean Spaces (media uploads)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-spaces-key
AWS_SECRET_ACCESS_KEY=your-spaces-secret
AWS_DEFAULT_REGION=sgp1
AWS_BUCKET=your-bucket
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=https://your-bucket.sgp1.digitaloceanspaces.com
```

### Create a DigitalOcean Space

1. In DigitalOcean → **Spaces Object Storage → Create Space**
2. Choose a region (e.g. `sgp1`) and a unique bucket name
3. Under **Settings → CORS**, allow your domain if needed for direct browser uploads
4. Create **API keys** under **API → Spaces Keys**
5. Set the Space to **Public** (or use CDN endpoint as `AWS_URL`) so uploaded media URLs work on the site

Paste the key, secret, bucket, and endpoint into `.env.docker`.

Generate `APP_KEY` (or let the deploy script do it):

```bash
docker run --rm php:8.3-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

### 3. Start the stack

```bash
chmod +x scripts/docker-prod.sh
./scripts/docker-prod.sh up
```

First deploy with seed data:

```bash
# In .env.docker set RUN_SEED=true, then:
./scripts/docker-prod.sh up
# Set RUN_SEED=false afterward for future deploys
```

Or seed manually:

```bash
./scripts/docker-prod.sh seed
```

### 4. DNS + SSL

Point your domain A record to the Droplet IP.

**SSL with Certbot on the host** (simplest):

```bash
apt install -y certbot
docker compose -f docker-compose.prod.yml stop nginx
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Then put a host Nginx reverse proxy in front of Docker port 80, or mount certs into the nginx container (advanced).

**Alternative:** use [DigitalOcean Load Balancer](https://docs.digitalocean.com/products/networking/load-balancers/) with managed SSL terminating HTTPS and forwarding HTTP to the Droplet.

### 5. Verify

```bash
./scripts/docker-prod.sh check
curl http://localhost/api/health
```

---

## Option B — Droplet + DigitalOcean Managed PostgreSQL

Use Docker for the app; use Managed PostgreSQL for the database (recommended for production).

### 1. Create Managed PostgreSQL

In DigitalOcean → **Databases → PostgreSQL**:

- Create DB: `destination_studio`
- Add your Droplet IP under **Trusted sources**
- Note host, port, user, password

### 2. Configure `.env.docker`

```env
DB_HOST=your-cluster.db.ondigitalocean.com
DB_PORT=25060
DB_DATABASE=destination_studio
DB_USERNAME=doadmin
DB_PASSWORD=your-managed-db-password
DB_SSLMODE=require
```

Do **not** use the bundled Postgres profile:

```bash
DOCKER_PROFILE="" ./scripts/docker-prod.sh up
```

Or:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.docker up -d --build
```

---

## Storage — DigitalOcean Spaces (default)

Media uploads use **S3-compatible storage** via DigitalOcean Spaces. `.env.docker.example` sets `FILESYSTEM_DISK=s3` by default.

Required variables:

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-spaces-key
AWS_SECRET_ACCESS_KEY=your-spaces-secret
AWS_DEFAULT_REGION=sgp1
AWS_BUCKET=your-bucket
AWS_ENDPOINT=https://sgp1.digitaloceanspaces.com
AWS_USE_PATH_STYLE_ENDPOINT=false
AWS_URL=https://your-bucket.sgp1.digitaloceanspaces.com
```

After changing storage env, rebuild and restart:

```bash
./scripts/docker-prod.sh up
./scripts/docker-prod.sh check
```

**Local disk instead of Spaces** (testing only):

```env
FILESYSTEM_DISK=public
```

When using `public`, uploads are stored in the Docker `app_storage` volume and served via Nginx at `/storage/`.

---

## Day-to-day commands

```bash
./scripts/docker-prod.sh up       # build + start
./scripts/docker-prod.sh down     # stop stack
./scripts/docker-prod.sh logs     # all logs
./scripts/docker-prod.sh logs app # one service
./scripts/docker-prod.sh migrate  # run migrations
./scripts/docker-prod.sh check    # deploy:check
```

Manual compose:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.docker --profile bundled-db up -d --build
```

---

## Updates (new code)

```bash
cd /var/www/destination-studio
git pull
./scripts/docker-prod.sh up   # rebuilds images and restarts
./scripts/docker-prod.sh migrate
```

---

## Post-deploy checklist

- [ ] `./scripts/docker-prod.sh check` passes
- [ ] `GET /api/health` returns `"status": "ok"`
- [ ] Change default admin password
- [ ] Homepage, admin login, contact form work
- [ ] Configure SMTP (not `log` driver) in `.env.docker`
- [ ] Enable backups for PostgreSQL (Managed DB or Droplet snapshots)
- [ ] Set `RUN_SEED=false` after first deploy

---

## Troubleshooting

**Build fails on Droplet (out of memory)**  
Use a 4 GB Droplet, or build locally and push images to a registry.

**Database connection failed**  
- Bundled DB: ensure `--profile bundled-db` is used and `DB_HOST=postgres`
- Managed DB: check trusted sources, `DB_SSLMODE=require`, firewall

**502 from Nginx**  
```bash
docker compose -f docker-compose.prod.yml logs app nginx
```

**Uploads not showing**  
- With **Spaces (`FILESYSTEM_DISK=s3`)**: verify `AWS_*` credentials, bucket is public (or CDN URL set as `AWS_URL`), and `./scripts/docker-prod.sh check` passes S3 checks  
- With **local disk (`FILESYSTEM_DISK=public`)**: ensure `app_storage` volume is mounted on both `app` and `nginx`, then run:

```bash
docker compose -f docker-compose.prod.yml exec app php artisan storage:link --force
```

**Stale config after env change**  
```bash
docker compose -f docker-compose.prod.yml exec app php artisan config:cache
docker compose -f docker-compose.prod.yml restart app queue scheduler
```

---

## Files reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production image |
| `docker-compose.prod.yml` | Production stack |
| `.env.docker.example` | Environment template |
| `scripts/docker-prod.sh` | Deploy helper |
| `deploy/docker/nginx.conf` | Nginx site config |
| `deploy/docker/entrypoint.sh` | Migrate + cache on start |

See also: [Single-domain deployment](./deployment-single-domain.md) (non-Docker) · [Production deployment](./deployment.md)
