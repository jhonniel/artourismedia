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
| Public site | http://localhost:5173 |
| Admin panel | http://localhost:5174 |
| API | http://localhost:8000/api |

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
- `http://localhost:5173` (public site)
- `http://localhost:5174` (admin)

Update `FRONTEND_URL` and `ADMIN_URL` in `.env` for production.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:8000`.

## Admin Setup

```bash
cd admin
npm install
cp .env.example .env
npm run dev
```

Login at http://localhost:5174 with admin credentials.

## Production Deployment

### Backend

1. Set `APP_ENV=production`, `APP_DEBUG=false`
2. Configure PostgreSQL connection
3. Run `php artisan migrate --force`
4. Run `php artisan config:cache && php artisan route:cache`
5. Configure web server (Nginx/Apache) pointing to `public/`
6. Set up queue worker if using async jobs
7. Configure file storage (S3/DO Spaces for media)

### Frontends

Build static assets and serve via CDN or Nginx:

```bash
cd frontend && npm run build   # output: frontend/dist/
cd admin && npm run build      # output: admin/dist/
```

Set `VITE_API_URL` to your production API URL before building.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Verify `FRONTEND_URL`/`ADMIN_URL` in backend `.env` |
| 401 on admin | Check Sanctum token in localStorage; re-login |
| Images not loading | Run `php artisan storage:link` |
| Migration fails on users | Run `migrate:fresh --seed` on fresh install |
