# API Reference

Base URL: `http://localhost:8000/api`

All responses follow:

```json
{ "success": true, "message": "Success", "data": {} }
```

Errors:

```json
{ "success": false, "message": "Validation failed", "errors": {} }
```

---

## Public Endpoints

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | API health check (database, cache, storage) |

Returns `503` if any dependency check fails.

### Site

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/site` | No | Site settings, statistics, trust strip |
| GET | `/navigation` | No | Active navigation items |
| GET | `/homepage` | No | Homepage sections with content |
| GET | `/social-links` | No | Active social links |
| GET | `/sitemap` | No | Sitemap URLs as JSON |
| GET | `/sitemap.xml` | No | Sitemap XML |

### Preview (token required, 2-hour expiry)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/preview/{uuid}?token=` | Draft/unpublished post |
| GET | `/projects/preview/{uuid}?token=` | Unpublished project |
| GET | `/services/preview/{uuid}?token=` | Inactive service |

Generate tokens from admin: `POST /admin/posts/{uuid}/preview-token`, same for projects and services.

### Services

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/services` | No | List active services |
| GET | `/services/{slug}` | No | Service detail |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | No | Paginated published projects |
| GET | `/projects/{slug}` | No | Project detail with related |

**Query params:** `page`, `per_page`, `featured`, `category`

### Blog Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | No | Paginated published posts |
| GET | `/posts/{slug}` | No | Post detail with related + prev/next |
| GET | `/categories` | No | Active post categories |

**Query params:** `page`, `per_page`, `search`, `category`, `featured`, `tag`

### Pages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/pages/{slug}` | No | CMS page content (+ optional `metadata` JSON) |

The About page (`/pages/about`) includes structured `metadata` for values, timeline, and team sections.

### Forms

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/contact` | No | `name`, `email`, `company?`, `phone?`, `subject?`, `message` |
| POST | `/newsletter` | No | `email`, `name?` |
| POST | `/newsletter/unsubscribe` | No | `email` and optional `token` |

---

## Admin Endpoints

All admin routes require `Authorization: Bearer {token}` from login unless noted.

### Authentication

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/admin/login` | No | `{ "email", "password" }` |
| POST | `/admin/forgot-password` | No | `{ "email" }` |
| POST | `/admin/reset-password` | No | `{ "email", "token", "password", "password_confirmation" }` |
| POST | `/admin/logout` | Yes | — |
| GET | `/admin/me` | Yes | — |
| GET | `/admin/dashboard` | Yes | — |

**Login response:**

```json
{
  "success": true,
  "data": {
    "token": "1|...",
    "user": { "uuid": "...", "name": "...", "email": "...", "role": "admin" }
  }
}
```

### Roles & permissions

| Role | Access |
|------|--------|
| **admin** | Full access including settings, users, activity log, cache flush |
| **editor** | Content, website, communications (no settings/users) |
| **author** | Own posts, media, dashboard (scoped to own content) |

Unauthorized role access returns `403`.

### CRUD Resources

Standard REST for all resources using `uuid` as route parameter:

| Resource | Base Path | Roles |
|----------|-----------|-------|
| Posts | `/admin/posts` | admin, editor, author* |
| Categories | `/admin/categories` | admin, editor |
| Tags | `/admin/tags` | admin, editor |
| Services | `/admin/services` | admin, editor |
| Projects | `/admin/projects` | admin, editor |
| Project Categories | `/admin/project-categories` | admin, editor |
| Statistics | `/admin/statistics` | admin, editor |
| Media | `/admin/media` | admin, editor, author |
| Navigation | `/admin/navigation` | admin, editor |
| Pages | `/admin/pages` | admin, editor |
| Homepage Sections | `/admin/homepage-sections` | admin, editor |
| Trust Strip Items | `/admin/trust-strip-items` | admin, editor |
| Social Links | `/admin/social-links` | admin, editor |
| Contact Submissions | `/admin/contact-submissions` | admin, editor |
| Newsletter Subscribers | `/admin/newsletter-subscribers` | admin, editor |
| Settings | `/admin/settings` | admin |
| SEO Settings | `/admin/seo-settings` | admin |
| Users | `/admin/users` | admin |
| Activity Logs | `/admin/activity-logs` | admin |

\*Authors can only access their own posts.

### Bulk actions

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/admin/posts/bulk` | `{ "uuids": [], "action": "publish\|draft\|archive\|delete" }` |
| POST | `/admin/contact-submissions/bulk` | `{ "uuids": [], "action": "mark_read\|delete" }` |

### Preview tokens

| Method | Endpoint |
|--------|----------|
| POST | `/admin/posts/{uuid}/preview-token` |
| POST | `/admin/projects/{uuid}/preview-token` |
| POST | `/admin/services/{uuid}/preview-token` |

Returns `{ "token", "preview_url" }`.

### Reorder Endpoints

POST with body `{ "ordered_uuids": ["uuid1", "uuid2", ...] }`:

- `/admin/navigation/reorder`
- `/admin/homepage-sections/reorder`
- `/admin/trust-strip-items/reorder`
- `/admin/services/reorder`
- `/admin/projects/reorder`
- `/admin/statistics/reorder`
- `/admin/social-links/reorder`
- `/admin/categories/reorder`
- `/admin/project-categories/reorder`

### Cache

| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/admin/cache/flush` | admin |

### Media Upload

```
POST /admin/media/upload
Content-Type: multipart/form-data
Field: file (image, max 5MB)
```

### Settings bulk update

```
PUT /admin/settings/bulk
Body: { "settings": [{ "key": "...", "value": "..." }] }
```

---

## Post Create/Update Body

```json
{
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short summary",
  "content": "<p>HTML content</p>",
  "post_category_uuid": "uuid",
  "tag_uuids": ["uuid1"],
  "author_uuid": "uuid",
  "featured_image_url": "https://...",
  "status": "published",
  "is_featured": true,
  "allow_social_sharing": true,
  "published_at": "2026-08-13T10:00:00Z",
  "seo_title": "...",
  "seo_description": "...",
  "seo_keywords": "..."
}
```

---

## Page metadata (About page)

Optional JSON on pages for structured layouts:

```json
{
  "metadata": {
    "values": [{ "title": "...", "description": "...", "icon": "🎯" }],
    "timeline": [{ "year": "1992", "title": "...", "description": "..." }],
    "team": [{ "name": "...", "role": "...", "bio": "..." }]
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 401 | Unauthenticated |
| 403 | Forbidden (invalid role or preview token) |
| 404 | Not found |
| 422 | Validation error |
| 429 | Rate limited |
| 500 | Server error |

---

## Rate Limiting

| Limiter | Scope |
|---------|--------|
| Default public API | 120 requests/minute per IP |
| Admin API | 120 requests/minute per authenticated user |
| `login` | 5 attempts/minute |
| `forgot-password` | 3 attempts/minute |
| `contact` | 5 submissions/minute |
| `newsletter` | 5 requests/minute |
