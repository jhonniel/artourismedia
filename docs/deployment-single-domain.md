# Single-Domain Deployment (Unified — One Server, One Domain)

Everything runs together under **one domain** and **one web root** (`backend/public`).

| URL | App |
|-----|-----|
| `https://yourdomain.com/` | Public website |
| `https://yourdomain.com/admin/` | Admin panel |
| `https://yourdomain.com/api/` | Laravel API |

---

## Quick deploy (3 commands)

```bash
npm run build          # builds site + admin, copies into backend/public
cd backend
php artisan migrate --force && php artisan config:cache
```

Then point Nginx at `backend/public` (see `deploy/nginx/single-domain.conf`) or run:

```bash
npm run start          # local production test on http://localhost:8000
```

---

## What `npm run build` does

1. Builds the React public site
2. Builds the Vue admin (at `/admin/`)
3. Copies both into `backend/public/` alongside Laravel

After that you deploy **one folder**: `backend/` (with `public/` containing everything).

---

## Server setup (Ubuntu)

```bash
sudo apt update
sudo apt install -y nginx postgresql redis-server \
  php8.3-fpm php8.3-pgsql php8.3-mbstring php8.3-xml php8.3-curl \
  php8.3-zip php8.3-gd php8.3-redis composer git certbot python3-certbot-nginx nodejs npm
```

Clone, configure backend, build:

```bash
sudo git clone YOUR_REPO /var/www/destination-studio
cd /var/www/destination-studio/backend
cp .env.single-domain.example .env
nano .env

composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

cd ..
npm run build

php artisan deploy:check
php artisan config:cache
php artisan route:cache
```

Nginx:

```bash
sudo cp deploy/nginx/single-domain.conf /etc/nginx/sites-available/destination-studio.conf
sudo nano /etc/nginx/sites-available/destination-studio.conf
sudo ln -sf /etc/nginx/sites-available/destination-studio.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Queue worker + cron — same as [deployment.md](./deployment.md).

---

## Local development (one address)

```bash
npm run setup    # first time
npm run dev
```

Open **one URL**:

- Website: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin/`

---

## Local production test (one process)

```bash
npm run build
npm run start
```

Open `http://localhost:8000/` — site, admin, and API all on port 8000.

---

## Updates

```bash
git pull
cd backend && composer install --no-dev --optimize-autoloader && php artisan migrate --force
cd .. && npm run build
php artisan config:cache && php artisan route:cache
sudo systemctl reload nginx
```

---

## Environment (`.env`)

Use `backend/.env.single-domain.example`:

```env
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://yourdomain.com/admin
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=yourdomain.com
```

No separate `VITE_API_URL` needed in production — builds use `/api` automatically.
