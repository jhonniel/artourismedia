# Art Boncato Tourism Consultancy — CMS

A production-quality tourism consultancy CMS with a premium editorial public website, Vue admin dashboard, and Laravel REST API.

**Live site:** https://artourismedia.com

## Architecture

```
React Public Website (frontend/)  ──REST──►  Laravel API (backend/)  ◄──REST──  Vue Admin (admin/)
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    ▼                               ▼                               ▼
            PostgreSQL (server)          DigitalOcean Spaces (images)          Redis (optional)
            SQLite (local dev)
```

| App | Stack | Port (local) |
|-----|-------|--------------|
| **Public site** | React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query | `5173` |
| **Admin dashboard** | Vue 3, TypeScript, Vite, Pinia, TipTap | `5174` |
| **API** | Laravel 13, Sanctum, PostgreSQL (prod) / SQLite (dev) | `8000` |

## Quick Start (local)

```bash
npm install
npm run setup   # first time only — creates backend/.env with SQLite
npm run dev     # site + admin + API
```

- Website: http://localhost:5173/
- Admin: http://localhost:5173/admin/
- API health: http://localhost:8000/api/health

**Default admin credentials** (from seeder):
- Email: `admin@destinationstudio.test`
- Password: `password`

For local images from Spaces, copy `frontend/.env.example` → `frontend/.env` (includes `VITE_ASSETS_BASE_URL`).

### Manual setup (per app)

<details>
<summary>Backend, frontend, and admin separately</summary>

**Backend**

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

**Public website**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

**Admin dashboard**

```bash
cd admin
cp .env.example .env
npm install
npm run dev
```

</details>

## Environment Variables

| App | Key vars |
|-----|----------|
| **backend** | `DB_*`, `ASSETS_BASE_URL`, `DIGITALOCEAN_SPACES_*`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `ADMIN_URL` |
| **frontend** | `VITE_API_URL`, `VITE_ASSETS_BASE_URL` |
| **admin** | `VITE_API_URL`, `VITE_ADMIN_BASE` |

### Database

| Environment | Driver | Notes |
|-------------|--------|-------|
| **Local dev** | SQLite | Default via `npm run setup` — no Postgres install needed |
| **Production (server)** | **PostgreSQL** | Set in `backend/.env.production` → copy to `.env` on server |

Production example:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=destination_studio
DB_USERNAME=destination_user
DB_PASSWORD=your_password
```

Requires PHP **`pdo_pgsql`** on the server.

### Static images (DigitalOcean Spaces)

Site images (hero slideshow, logos, seed assets) are **not bundled** in deploy zips. They are served from Spaces:

```env
ASSETS_BASE_URL=https://infosoft.sgp1.digitaloceanspaces.com/tingog/reports/static
DIGITALOCEAN_SPACES_KEY=...
DIGITALOCEAN_SPACES_SECRET=...
```

Upload or refresh static assets from your dev machine:

```bash
npm run assets:upload
```

Admin media uploads also go to Spaces (not local disk).

## Features

### Public Website
- Dynamic homepage from CMS (hero, trust strip, about, services, projects, statistics, insights)
- Structured About page (values, timeline, team from CMS metadata)
- Blog with search, category filter, pagination, prev/next navigation
- Draft preview links for posts, projects, and services
- Project case studies with detail pages
- Contact form and newsletter subscription/unsubscribe
- SEO metadata, JSON-LD structured data, sitemap, lazy loading, responsive design
- Mobile social links + desktop sidebar on homepage

### Admin Dashboard
- Sanctum token authentication with password reset flow
- Role-based access: **admin**, **editor**, **author**
- Dashboard with statistics and recent activity (scoped for authors)
- Full CRUD for posts, pages, categories, projects, services, statistics
- Bulk actions on posts (publish/draft/archive/delete) and contact submissions
- Reorder UI for categories, services, and projects
- TipTap rich text editor for posts, pages, projects, and services
- Post/project/service preview tokens
- Media library with upload
- Homepage section management (enable/disable, reorder, edit)
- Navigation, footer, social links, appearance settings
- Users CRUD, activity log, cache flush (admin only)
- Contact submissions and newsletter subscribers

### API
- RESTful JSON API with consistent `{ success, data }` responses
- Public endpoints for site content
- Protected admin endpoints with Sanctum and role middleware
- Rate limiting, CORS, validation, HTML sanitization, file upload security
- Email notifications for contact, newsletter, and password reset

## Testing

```bash
cd backend
php artisan test
php artisan deploy:check
```

The test suite covers authentication, password reset, authorization, posts CRUD/bulk, previews, pages, contact, newsletter, health checks, filters, and dashboard.

**Health endpoint:** `GET /api/health` — returns database, cache, and storage status (use for uptime monitoring).

### End-to-end (Playwright)

Smoke tests cover the public API, public website pages, and admin login.

```bash
# From repo root — prepares SQLite DB, then runs Playwright (starts backend + dev servers)
npm install
npm run e2e:prepare
npm run e2e
```

Use `npm run e2e:ui` for the interactive runner. If servers are already running locally, Playwright reuses them unless `CI=true`.

**CI:** GitHub Actions runs backend tests, frontend/admin builds, and Playwright E2E on push/PR to `main`/`master`.

## Documentation

- **[Deployment Guide (DEPLOY.md)](DEPLOY.md)** — start here for production
- [Setup Guide](docs/setup.md)
- [API Reference](docs/api.md)
- [Database Schema](docs/database.md)
- [Production Deployment](docs/deployment.md)
- [Single-Domain Deployment (one server, one domain)](docs/deployment-single-domain.md)
- [Docker Production Deployment (DigitalOcean)](docs/deployment-docker.md)

## Production Build & Deploy

Build deploy packages on your PC (no Docker required):

```bash
npm run build:deploy
```

Output in `dist/` (tracked in git for server deploy):

| File | Size | Use |
|------|------|-----|
| **`web-deploy.zip`** | ~3 MB | Full app — Laravel API + website + admin (no images) |
| **`static-web.zip`** | ~3 MB | UI-only update when API is already on the server |
| **`README.txt`** | — | Server setup checklist |

After code changes, rebuild and commit updated zips:

```bash
npm run build:deploy
git add dist/
git commit -m "Update deploy packages"
```

### Server setup (PostgreSQL + Nginx)

1. Upload and unzip `web-deploy.zip` on the server (e.g. `/var/www/art-website/backend`).
2. Copy env and fill in secrets:

```bash
cd /var/www/art-website/backend
cp .env.production .env
nano .env
```

Set at minimum: `APP_KEY`, `DB_*` (PostgreSQL), `ADMIN_PASSWORD`, `DIGITALOCEAN_SPACES_KEY/SECRET`, `ASSETS_BASE_URL`.

3. Install and migrate:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate          # if APP_KEY is empty
php artisan migrate --force
php artisan db:seed --force       # first deploy only
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

4. Point Nginx document root to `backend/public` (see `deploy/nginx/single-domain.conf`).

**URLs:** https://artourismedia.com/ · `/admin/` · `/api/`

See also **[DEPLOY.md](DEPLOY.md)** and **`dist/README.txt`** for the full checklist.

### Local production test

```bash
npm run build
npm run start   # http://localhost:8000
```

Unified build (website + admin into `backend/public/`):

```bash
npm run build
```

## Changelog (high level)

| Phase | Focus |
|-------|--------|
| 1–3 | Monorepo scaffold, API integration, homepage editors, sitemap, visual polish |
| 4 | Pages admin, appearance settings, cache service, deployment docs |
| 5 | Password reset, email notifications, activity log, users admin, SEO/JSON-LD basics |
| 6.1 | Reorder UI, bulk actions, list filters |
| 6.2 | Role-based authorization (admin/editor/author) |
| 6.3 | Mobile social links, local hero assets, JSON-LD on key pages, card hovers |
| 6.4 | Project/service preview, structured About page metadata |
| 6.5 | Expanded PHPUnit coverage, documentation updates |
| 7 | Launch readiness: health API, deploy check, seed assets, demo users |
| 8 | Admin filters (contact/projects), About page metadata editor |
| 9 | Playwright E2E smoke tests, GitHub Actions CI pipeline |
| 10 | Production deployment toolkit: Docker staging, build script, nginx templates, security headers |
| 11 | One-command local dev: `npm run setup` + `npm run dev` |
| 12 | Spaces-hosted static assets, slim deploy zips (`build:deploy`), mockup cleanup |

## License

Proprietary — Art Boncato Tourism Consultancy
