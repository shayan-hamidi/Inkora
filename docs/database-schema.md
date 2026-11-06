# INKORA Database Schema

This document matches the version-controlled SQL migrations under [`supabase/migrations/`](../supabase/migrations/).

Last updated: Phase 4 (catalog schema + seed).

---

## Overview

| Area | Tables | Notes |
| --- | --- | --- |
| Auth profiles | `profiles` | Created on signup; role protected |
| Catalog taxonomies | `categories`, `styles`, `placements`, `tags` | Public read |
| Catalog content | `tattoos`, `tattoo_styles`, `tattoo_placements`, `tattoo_tags` | Published rows are public |
| Storage | bucket `tattoo-images` | Public read; admin write |

Not yet implemented (later phases): `favorites`, `collections`, `collection_items`, `ai_generations`, `ai_generation_images`, `artist_profiles`, consultation requests.

---

## Entity relationship (catalog)

```mermaid
erDiagram
  profiles ||--o| profiles : "role user|admin"
  categories ||--o{ tattoos : categorizes
  tattoos ||--o{ tattoo_styles : has
  styles ||--o{ tattoo_styles : on
  tattoos ||--o{ tattoo_placements : has
  placements ||--o{ tattoo_placements : on
  tattoos ||--o{ tattoo_tags : has
  tags ||--o{ tattoo_tags : on
```

---

## Tables

### `profiles` (Phase 3)

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | FK → `auth.users.id` |
| `display_name` | `text` | Optional, ≤ 80 chars |
| `role` | `user_role` | `user` \| `admin`; default `user` |
| `created_at` / `updated_at` | `timestamptz` | |

**Security**

- RLS enabled
- Users can select/update their own row
- Authenticated users can update only `display_name`, `updated_at`
- Role changes blocked unless JWT role is `service_role`
- Signup trigger `handle_new_user` inserts a profile with role `user`

### `categories` / `styles` / `placements` / `tags`

Shared shape (tags omit `description`):

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `name` | `text` | Required |
| `slug` | `text` unique | kebab-case |
| `description` | `text` | Optional (not on `tags`) |
| `created_at` / `updated_at` | `timestamptz` | |

### `tattoos`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `title` | `text` | |
| `slug` | `text` unique | |
| `description` | `text` | |
| `category_id` | `uuid` FK | nullable |
| `image_path` | `text` | App path or storage object path |
| `image_alt` | `text` | Accessibility text |
| `image_width` / `image_height` | `integer` | Optional |
| `source` | `text` | Origin of the asset |
| `attribution` | `text` | Credit line |
| `license` | `text` | Usage terms |
| `is_demo` | `boolean` | Demo/synthetic content flag |
| `is_published` | `boolean` | Public visibility |
| `is_featured` | `boolean` | Landing/featured surfaces |
| `search_vector` | `tsvector` | Generated FTS column |
| `created_at` / `updated_at` | `timestamptz` | |

### Join tables

- `tattoo_styles (tattoo_id, style_id)`
- `tattoo_placements (tattoo_id, placement_id)`
- `tattoo_tags (tattoo_id, tag_id)`

Composite primary keys; cascade on tattoo/taxonomy delete.

---

## Indexes

- Slug indexes on taxonomies and tattoos
- `tattoos(category_id)`
- `tattoos(is_published, is_featured, created_at desc)`
- GIN index on `tattoos.search_vector`
- Reverse FK indexes on join tables

---

## Full-text search

`tattoos.search_vector` weights:

- **A** — title
- **B** — description
- **C** — attribution

Example query shape (implemented in Phase 5/8 data-access):

```sql
select *
from public.tattoos
where is_published = true
  and search_vector @@ websearch_to_tsquery('english', 'moon floral');
```

---

## Row Level Security

| Table | `anon` / `authenticated` read | Write |
| --- | --- | --- |
| Taxonomies | all rows | admins only (`is_admin()`) |
| `tattoos` | `is_published = true` | admins only |
| Join tables | when linked tattoo is published | admins only |
| `profiles` | own row | own display fields; role locked |
| `storage.objects` (`tattoo-images`) | public read | admins only |

`service_role` bypasses RLS (seeds, admin tooling, trusted server jobs).

Helper: `public.is_admin()` — true when the authenticated user's profile role is `admin`.

---

## Storage

Bucket: **`tattoo-images`**

- Public read
- MIME allow-list: jpeg, png, webp, svg
- File size limit: 5 MiB
- Seed demo images currently live in the Next.js `public/demo/tattoos/` folder and are referenced by `image_path` (no portfolio scraping)

---

## Seed content policy

[`supabase/seed.sql`](../supabase/seed.sql) inserts clearly labeled **synthetic demo artwork**:

- `is_demo = true`
- `source = 'INKORA demo assets'`
- `license` states demo-only usage
- One unpublished row exists to verify RLS hide behavior

No scraped tattoo portfolios are included.

---

## Migrations

| File | Purpose |
| --- | --- |
| `20261106190000_create_profiles.sql` | Profiles, role protection, signup trigger |
| `20261106200000_create_catalog_schema.sql` | Catalog, FTS, RLS, storage bucket |

Apply locally:

```bash
pnpm db:reset
```
