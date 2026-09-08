# Art Boncato Tourism Consultancy

Public website + admin CMS + Laravel API for [artourismedia.com](https://artourismedia.com).

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

## Deploy to server

### Which file to upload?

There are **two zips** in `dist/` — you only deploy **one**:

| File | Deploy? | Contains |
|------|---------|----------|
| **`dist/web-deploy.zip`** | **Yes — use this** | Website + admin + Laravel API + `index.php` |
| `dist/static-web.zip` | No (not yet) | UI only — **no API**, causes `/api/*` 404 |

Do **not** upload both. Do **not** upload `frontend/` or `admin/` folders separately.

### Build on your PC

```bash
npm run build:deploy
```

### First deploy on server

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

### After deploy — verify

```bash
curl -s https://artourismedia.com/api/health    # JSON, success: true
curl -I https://artourismedia.com/index.php     # must NOT say "File not found"
```

| Live URL | Served by |
|----------|-----------|
| https://artourismedia.com/ | `index.php` → Laravel → `index.html` (website) |
| https://artourismedia.com/admin/ | `index.php` → Laravel → `admin/index.html` |
| https://artourismedia.com/api/site | `index.php` (Laravel API) |

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

### Server folder layout (after unzip)

```
/var/www/artourismedia.com/
  app/  routes/  artisan/  vendor/     ← Laravel
  .env.production.example               ← copy to .env
  scripts/server-after-unzip.sh
  public/                               ← Nginx root
    index.php                           ← single entry point
    index.html                          ← built website (served by Laravel)
    admin/index.html                    ← built admin (served by Laravel)
```

Images are **not** in the zip — they load from **DigitalOcean Spaces**.  
Upload from PC: `npm run assets:upload`

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
| `npm run dev` | Local dev (all apps) |
| `npm run build:deploy` | Build `dist/web-deploy.zip` |
| `npm run assets:upload` | Upload images to Spaces |
| `php artisan deploy:check` | Verify server config (run on server) |
| `bash scripts/verify-deploy.sh` | Check files exist after unzip (run on server) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/*` 404 "File not found" | Deploy `web-deploy.zip` (not static-web). Check `public/index.php` exists. Nginx root → `public/` |
| Blank landing page | `php artisan cache:clear` on server |
| API 500 permission denied | `sudo chown -R www-data:www-data /var/www/artourismedia.com` |

---

## Docs

- [Setup](docs/setup.md) — local dev details
- [API](docs/api.md) — endpoints
- [Database](docs/database.md) — schema

## License

Proprietary — Art Boncato Tourism Consultancy
