# Database Schema

## Overview

PostgreSQL (production) or SQLite (development). All public-facing entities use `uuid` columns for external references.

## Entity Relationship Diagram

```
users ────────────── posts
  │                    │
  │                    ├── post_category
  │                    └── tags (post_tag pivot)
  │
  ├── media (uploaded_by)
  └── activity_logs

homepage_sections (JSON content)
trust_strip_items
navigation_items
site_settings (key-value)
services
projects ── project_categories
statistics
social_links
contact_submissions
newsletter_subscribers
seo_settings
pages
```

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | Internal only |
| uuid | uuid | Public identifier |
| name | string | |
| email | string unique | |
| password | string | Hashed |
| role | string | Default: `admin` |
| timestamps | | |

### site_settings
Key-value store for brand, contact, SEO defaults.

| Column | Type |
|--------|------|
| key | string unique |
| value | text |
| type | string |
| group | string |

### navigation_items
| Column | Type |
|--------|------|
| uuid | uuid |
| label, url | string |
| is_active, is_cta | boolean |
| sort_order | integer |
| soft deletes | |

### homepage_sections
| Column | Type |
|--------|------|
| type | string (hero, about, services, etc.) |
| content | json |
| is_active | boolean |
| sort_order | integer |

### trust_strip_items
Partner/trust badges with icon, title, description, link.

### services
Tourism service offerings with slug, content, icon, image, CTA.

### project_categories / projects
Case studies with cover image, category, featured/published flags, SEO fields.

### post_categories / posts / tags
Full blog CMS with rich content, SEO, featured flag, reading time.

### media
Uploaded files with dimensions, MIME type, alt text, thumbnail URL.

### statistics
Homepage stat counters with prefix/suffix, icon, order.

### social_links
Platform links with username, URL, active flag.

### contact_submissions
Form submissions with read status.

### newsletter_subscribers
Email subscriptions with unsubscribe token.

### seo_settings
Per-page SEO metadata.

### pages
Static CMS pages (about, privacy, etc.). Optional `metadata` JSON column supports structured layouts (e.g. About page values, timeline, team).

### activity_logs
Admin audit trail.

## Indexes

- `posts(status, published_at)` — blog listing
- `posts.is_featured` — featured filter
- `activity_logs(subject_type, subject_id)` — audit queries
- All `uuid` columns — unique indexed
- All `slug` columns — unique indexed

## Soft Deletes

Applied to: navigation_items, homepage_sections, trust_strip_items, services, projects, posts, categories, tags, media, statistics, social_links, pages.

## Migrations

Run from backend:

```bash
php artisan migrate
php artisan db:seed
```

Migration file: `database/migrations/2026_08_13_000001_create_cms_tables.php`
