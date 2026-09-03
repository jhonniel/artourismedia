# Destination Studio CMS

A production-quality tourism consultancy CMS with a premium editorial public website, Vue admin dashboard, and Laravel REST API.

## Architecture

```
React Public Website (frontend/)  ──REST──►  Laravel API (backend/)  ◄──REST──  Vue Admin (admin/)
                                                    │
                                                    ▼
                                              PostgreSQL / SQLite
```

| App | Stack | Port |
|-----|-------|------|
| **Public site** | React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query | `5173` |
| **Admin dashboard** | Vue 3, TypeScript, Vite, Pinia, TipTap | `5174` |
| **API** | Laravel 13, Sanctum, PostgreSQL/SQLite | `8000` |

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

**Default admin credentials** (from seeder):
- Email: `admin@destinationstudio.test`
- Password: `password`

**Demo role accounts** (from seeder):
- Editor: `editor@destinationstudio.test` / `password`
- Author: `author@destinationstudio.test` / `password`

### 2. Public Website

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

### 3. Admin Dashboard

```bash
cd admin
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5174

## Environment Variables

See `.env.example` in each app:

- **backend**: `DB_*`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `ADMIN_URL`, `MAIL_*`
- **frontend**: `VITE_API_URL=http://localhost:8000/api`
- **admin**: `VITE_API_URL=http://localhost:8000/api`

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

## Production Build

Unified build (default — website + admin + API on one domain):

```bash
npm run build
```

Output lands in `backend/public/` — deploy that folder with Laravel.

Legacy multi-subdomain build:

```bash
SINGLE_DOMAIN=0 VITE_API_URL=https://api.example.com/api npm run build
```

### Staging stack (Docker)

Run PostgreSQL, Redis, and Mailpit locally to mirror production infrastructure:

```bash
docker compose up -d
cp backend/.env.staging.example backend/.env
cd backend && composer install && php artisan key:generate && php artisan migrate --seed
```

Mailpit inbox: `http://localhost:8025`

### Production stack (Docker)

Full production deploy with Nginx, PHP-FPM, Redis, queue worker, and PostgreSQL:

```bash
cp .env.docker.example .env.docker
# edit .env.docker — set domain, DB password, admin password
chmod +x scripts/docker-prod.sh
./scripts/docker-prod.sh up
```

See [Docker Production Deployment](docs/deployment-docker.md) for DigitalOcean setup (Droplet + Managed PostgreSQL or bundled Postgres).

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

## Quick Start (local)

```bash
npm install
npm run setup   # first time only
npm run dev     # one address: site + admin + API
```

- Website: http://localhost:5173/
- Admin panel: http://localhost:5173/admin/
- API health: http://localhost:8000/api/health

## Production (unified — one domain, one deploy)

```bash
npm run build   # builds site + admin into backend/public/
npm run start   # optional local test on http://localhost:8000
```

Deploy the `backend/` folder to your server. Nginx root: `backend/public`.  
See **[DEPLOY.md](DEPLOY.md)** for full instructions (Docker or Nginx + PHP).

## License

Proprietary — Destination Studio CMS
