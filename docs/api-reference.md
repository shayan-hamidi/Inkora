# INKORA API Reference

Documents route handlers that currently exist. Do not treat this as a full product API surface.

---

## `GET /api/health`

Liveness check for the Next.js app.

### Response `200`

```json
{
  "ok": true,
  "service": "inkora",
  "timestamp": "2026-11-06T00:00:00.000Z"
}
```

---

## `GET /api/search`

Public tattoo search and filter endpoint used by clients that prefer JSON over server-rendered gallery pages.

### Query parameters

| Param | Type | Notes |
| --- | --- | --- |
| `q` | string | Optional full-text query (max 100) |
| `category` | string | Category slug |
| `style` | string | Style slug |
| `placement` | string | Placement slug |
| `tag` | string | Tag slug |
| `page` | number | Default `1` |
| `pageSize` | number | Default `12`, max `48` |

Invalid params return `400` with Zod field errors.

### Response `200`

```json
{
  "items": [
    {
      "id": "...",
      "title": "Quiet Moon",
      "slug": "quiet-moon",
      "description": "...",
      "imagePath": "/demo/tattoos/minimal-moon.svg",
      "imageAlt": "...",
      "isDemo": true,
      "isFeatured": true,
      "category": { "id": "...", "name": "Nature", "slug": "nature" },
      "styles": [],
      "placements": [],
      "tags": []
    }
  ],
  "page": 1,
  "pageSize": 12,
  "totalCount": 5,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

### Errors

| Status | When |
| --- | --- |
| `400` | Invalid query params |
| `500` | Catalog query failure |

---

## Auth routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/auth/callback` | `GET` | Exchanges Supabase auth code for a session |
| Server Actions in `features/authentication` | POST (form) | Login, register, reset password, logout |

These are not JSON APIs; they are form/server-action endpoints.

---

## Favorites / collections / AI (server actions)

No public JSON APIs for mutations. Authenticated flows use server actions:

| Module | Actions |
| --- | --- |
| `features/favorites/server/actions` | `toggleFavoriteAction` |
| `features/collections/server/actions` | create / update / delete collection, add / remove items |
| `features/ai-studio/server/actions` | `generateConceptAction`, refine via `kind`, image request / licensed reference attach |

AI keys stay server-side. Invalid model JSON is discarded after Zod validation.
