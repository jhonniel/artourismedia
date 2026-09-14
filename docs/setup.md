# Setup Guide

## Quick Start (recommended)

From the repo root:

```bash
npm install
npm run setup   # installs deps, configures SQLite, migrates + seeds
npm run dev     # starts backend, frontend, and admin together
```

| App | URL |
|-----|-----|
| Public site | http://localhost:8000 |
| Admin panel | http://localhost:8000/admin/ |
| API | http://localhost:8000/api |

`npm run dev` builds the website and admin into `backend/public/`, then serves everything from port **8000** — one address, same as production.

Optional hot-reload mode: `DEV_HMR=1 npm run dev` (website on 5173, API still on 8000).

Default admin: `admin@destinationstudio.test` / `password`

## Prerequisites

- PHP 8.2+ with extensions: `pdo`, `pdo_pgsql` or `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `fileinfo`
- Composer 2.x
- Node.js 20+
- PostgreSQL 14+ (recommended) or SQLite (development default)

## Database Setup

### PostgreSQL (Production)

```sql
CREATE DATABASE destination_studio;
CREATE USER destination_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE destination_studio TO destination_user;
```

Update `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=destination_studio
DB_USERNAME=destination_user
DB_PASSWORD=your_password
```

### SQLite (Development)

Laravel ships with SQLite configured by default. No additional setup required.

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Admin User

The seeder creates an admin from environment variables:

```env
ADMIN_EMAIL=admin@destinationstudio.test
ADMIN_PASSWORD=password
ADMIN_NAME="Destination Studio Admin"
```

### CORS

Allowed origins are configured in `config/cors.php`:
- `http://localhost:8000` (unified local site)
- `http://localhost:5173` / `http://localhost:5174` (only when using `DEV_HMR=1`)

Update `FRONTEND_URL` and `ADMIN_URL` in `.env` for production.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

In unified mode, the website is served from `backend/public/` on port 8000. With `DEV_HMR=1`, the Vite dev server on 5173 proxies `/api` to port 8000.

## Admin Setup

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

Login at http://localhost:5174 with admin credentials.

## Production Deployment

Use the deploy zip — see **`dist/README.txt`** at the repo root.

```bash
npm run build:deploy
```

On the server: unzip → `cp .env.production.example .env` → `bash scripts/server-after-unzip.sh`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify `FRONTEND_URL`/`ADMIN_URL` in backend `.env` |
| 401 on admin | Check Sanctum token in localStorage; re-login |
| Images not loading | Run `php artisan storage:link` |
| Migration fails on users | Run `migrate:fresh --seed` on fresh install |
