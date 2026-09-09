# Art Boncato Tourism Consultancy

Public website + admin CMS + Laravel API for [artourismedia.com](https://artourismedia.com).

## Project layout

```
ART_WEBSITE/
  frontend/     React public website (Vite)
  admin/        Vue admin CMS (Vite)
  backend/      Laravel API + unified public web root
  scripts/      Build, deploy, asset upload
  dist/         Generated deploy zips
  deploy/       Nginx templates
  docs/         Setup, API, database notes
```

---

## Local development

```bash
npm install
npm run setup   # first time only
npm run dev
```

| URL | App |
|-----|-----|
| http://localhost:5173/ | Website |
| http://localhost:5173/admin/ | Admin |
| http://localhost:8000/api/health | API |

Admin (from seeder): `admin@destinationstudio.test` / `password`

Copy `frontend/.env.example` → `frontend/.env` for Spaces image URLs locally.

---

## Build deploy packages

```bash
npm run build:deploy
```

This builds the frontend and admin, copies them into `backend/public/`, stages Laravel, and writes:

| File | Size (approx.) | Use |
|------|----------------|-----|
| **`dist/web-deploy.zip`** | ~1.5 MB | **Full deploy** — website + admin + Laravel API |
| `dist/static-web.zip` | ~3.5 MB | **UI-only update** when API is already live |

Do **not** upload both zips. Do **not** upload `frontend/` or `admin/` source folders separately.

`npm run build` builds production assets locally without creating the zip (same Vite output, copied to `backend/public/`).

---

## Deploy to server

### First deploy

```bash
cd /var/www/artourismedia.com
unzip -o web-deploy.zip
cp .env.production.example .env && nano .env
SEED=1 bash scripts/server-after-unzip.sh
bash scripts/verify-deploy.sh
```

Fill in `.env`: `APP_KEY`, `DB_PASSWORD` (PostgreSQL), `ADMIN_PASSWORD`, `DIGITALOCEAN_SPACES_KEY/SECRET`.

**Nginx** document root must be the `public/` folder:

```nginx
root /var/www/artourismedia.com/public;
```

Template: `deploy/nginx/single-domain.conf`

### Updates (site already working)

```bash
cd /var/www/artourismedia.com
unzip -o web-deploy.zip
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan cache:clear
php artisan config:cache
```

Use `static-web.zip` **only** for a quick UI-only refresh when `/api/health` already works.

After UI or branding changes, upload CDN assets from your PC:

```bash
npm run assets:upload
```

This pushes images, favicons (`favicon.png`, `apple-touch-icon.png`), and other static files to DigitalOcean Spaces.

### After deploy — verify

```bash
curl -s https://artourismedia.com/api/health    # JSON, success: true
curl -I https://artourismedia.com/index.php     # must NOT say "File not found"
php artisan deploy:check
```

| Live URL | Served by |
|----------|-----------|
| https://artourismedia.com/ | `index.php` → Laravel → `index.html` (website) |
| https://artourismedia.com/admin/ | `index.php` → Laravel → `admin/index.html` |
| https://artourismedia.com/api/site | `index.php` (Laravel API) |

### Server folder layout (after unzip)

```
/var/www/artourismedia.com/
  app/  routes/  artisan/  vendor/     ← Laravel
  .env.production.example               ← copy to .env
  scripts/server-after-unzip.sh
  public/                               ← Nginx root
    index.php                           ← single entry point
    index.html                          ← built website
    admin/index.html                    ← built admin
    favicon.png                         ← bundled with deploy
```

Most images are served from **DigitalOcean Spaces**, not the zip. Brand logo and service icons are bundled; hero, about, and slideshow assets need `npm run assets:upload`.

Full server checklist: **`dist/README.txt`**

---

## Environment files

| File | Use |
|------|-----|
| `backend/.env.example` | Local dev (SQLite) |
| `backend/.env.production.example` | **Server** — copy to `.env` |
| `frontend/.env.example` | Local frontend |
| `admin/.env.example` | Local admin |

Production database: **PostgreSQL** (`DB_CONNECTION=pgsql` in `.env`).

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev (website + admin + API) |
| `npm run build` | Production build → `backend/public/` |
| `npm run build:deploy` | Build + create `dist/web-deploy.zip` and `dist/static-web.zip` |
| `npm run assets:upload` | Upload images and favicons to Spaces |
| `npm run start` | Run production-like server locally (after build) |
| `php artisan deploy:check` | Verify server config (run on server) |
| `bash scripts/verify-deploy.sh` | Check files exist after unzip (run on server) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/*` 404 "File not found" | Deploy `web-deploy.zip` (not static-web). Check `public/index.php` exists. Nginx root → `public/` |
| Blank landing page | `php artisan cache:clear` on server |
| First load OK, refresh blank | Redeploy full `web-deploy.zip`; clear cache |
| API 500 permission denied | `sudo chown -R www-data:www-data /var/www/artourismedia.com` |
| Missing images on production | Run `npm run assets:upload` from your PC |
| Mindanao CONNECT videos missing | `php artisan migrate --force` then `php artisan mindanao-connect:import-videos` |

---

## Docs

- [Setup](docs/setup.md) — local dev details
- [API](docs/api.md) — endpoints
- [Database](docs/database.md) — schema

## License

Proprietary — Art Boncato Tourism Consultancy
