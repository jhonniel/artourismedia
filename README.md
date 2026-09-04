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

## Deploy to server

**One zip. One folder. One Nginx root.**

```bash
npm run build:deploy
```

Upload **`dist/web-deploy.zip`**. Full steps: **`dist/README.txt`**

```bash
# on server
cd /var/www/artourismedia.com
unzip -o web-deploy.zip
cp .env.production.example .env && nano .env
SEED=1 bash scripts/server-after-unzip.sh
```

Nginx `root` → `.../public` (see `deploy/nginx/single-domain.conf`)

| URL | Serves |
|-----|--------|
| `/` | Website (`public/index.html`) |
| `/admin/` | Admin (`public/admin/`) |
| `/api/` | Laravel API (`public/index.php`) |

Images load from **DigitalOcean Spaces** (not in the zip). Upload assets: `npm run assets:upload`

## Env files (only these matter)

| File | Use |
|------|-----|
| `backend/.env.example` | Local dev (SQLite) |
| `backend/.env.production.example` | **Server** — copy to `.env` |
| `frontend/.env.example` | Local frontend |
| `admin/.env.example` | Local admin |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev (all apps) |
| `npm run build:deploy` | Build `dist/web-deploy.zip` |
| `npm run assets:upload` | Upload images to Spaces |
| `php artisan deploy:check` | Verify server config |

## Docs

- [Setup](docs/setup.md) — local dev details
- [API](docs/api.md) — endpoints
- [Database](docs/database.md) — schema

## License

Proprietary — Art Boncato Tourism Consultancy
