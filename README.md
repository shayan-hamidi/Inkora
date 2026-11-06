# INKORA

**Discover your next tattoo. Give your ideas meaning.**

INKORA is an AI-powered tattoo discovery and inspiration platform. It helps people find tattoo designs, explore styles and placements, save favorites, build collections, and generate personalized tattoo concepts with AI.

This repository is a portfolio-grade full-stack application. Development follows an incremental, phase-based process. Features are documented only after they exist.

---

## Current status

**Phases 0–18 complete — portfolio MVP roadmap finished**

Shipped surface: discovery, auth, favorites/collections, AI Studio, admin catalog tools, artist directory with store-only consultations, sitemap/robots, and deploy docs.

See [docs/development-phases.md](docs/development-phases.md) and [docs/product-specification.md](docs/product-specification.md).

---

## Product overview

INKORA is designed as a premium creative platform for:

1. Tattoo enthusiasts
2. People looking for their first tattoo
3. People looking for tattoo inspiration
4. Tattoo artists showcasing their work

### Planned features

Status legend: **planned** means not implemented yet.

| Feature | Priority | Status |
| --- | --- | --- |
| Tattoo discovery gallery | P1 | shipped |
| Search and filtering | P1 | shipped |
| Tattoo detail pages | P1 | shipped |
| Authentication | P1 | shipped |
| Favorites | P1 | shipped |
| Personal collections | P1 | shipped |
| AI tattoo concept generation | P2 | shipped |
| AI concept refinement | P2 | shipped |
| Optional AI image generation | P2 | shipped (unavailable by default) |
| Admin dashboard | P2 | shipped |
| Artist discovery and profiles | P3 | shipped |
| Consultation requests (store only) | P3 | shipped |

Out of scope for the initial release:

- Payments and subscriptions
- Real-time messaging
- Full 3D body simulator

---

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript (strict) |
| Styling | Tailwind CSS, shadcn/ui, Lucide icons |
| Animation | Motion (component transitions), GSAP (scroll timelines), React Three Fiber (isolated 3D) |
| Client state | Zustand (shared UI/session state when justified), TanStack Query (client server-state when justified) |
| Forms / validation | React Hook Form, Zod |
| Backend | Next.js Route Handlers and Server Actions |
| Data / auth / storage | Supabase (PostgreSQL, Auth, Storage, RLS) |
| AI text | Gemini API free tier |
| AI image (optional) | Hugging Face ZeroGPU or local generation |
| Testing | Vitest, React Testing Library, Playwright |
| Package manager | pnpm |
| Deployment | Vercel Hobby + Supabase Free |

---

## Architecture overview

Feature-oriented architecture under `src/`. Pages compose features; business logic lives in feature modules and `lib/`; database access is centralized; AI providers sit behind interfaces.

Full details: [docs/architecture.md](docs/architecture.md)

---

## Folder structure

Target structure (created incrementally across phases):

```text
src/
  app/
    (marketing)/
    (discovery)/
    (auth)/
    (dashboard)/
    studio/
    artists/
    admin/
    api/
  components/
    ui/
    layout/
    shared/
  features/
  lib/
  hooks/
  stores/
  types/
  styles/
supabase/
  migrations/
  seed.sql
tests/
  unit/
  integration/
  e2e/
docs/
```

Currently present (high level):

```text
src/app/                 App Router routes + design tokens
src/components/          ui, layout, shared
src/lib/                 env, utils, future supabase/ai
docs/                    architecture + phase plan
tests/                   unit, integration, e2e
.env.example             variable names only
```

---

## Prerequisites

- Node.js 22+
- pnpm 9+
- Docker (for local Supabase during development and tests — Phase 3+)
- Git

Optional later:

- A free Gemini API key (AI Studio text features)
- A free Hugging Face account (optional image generation)
- A Vercel Hobby account (deployment)
- A Supabase Free project (hosted deployment)

---

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For Playwright browsers (e2e):

```bash
pnpm exec playwright install chromium
```

---

## Environment variables

See [.env.example](.env.example) for variable **names only**. Copy to `.env.local` and fill values as later phases require them. No real credentials belong in this repository.

`src/lib/env.ts` validates env access with Zod (public vs server split).

---

## Supabase configuration

Development uses a **local Supabase stack** (CLI + Docker). Deployment uses a hosted Supabase Free project.

### Local setup

1. Install and start Docker Desktop.
2. From the repo root:

```bash
pnpm db:start
```

3. Copy the printed keys into `.env.local` (names match `.env.example`):

```bash
# Example mapping from `pnpm db:status` / `supabase status`
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Apply migrations (also runs on first start / reset):

```bash
pnpm db:reset
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `pnpm db:start` | Start local Supabase (Docker) |
| `pnpm db:stop` | Stop local Supabase |
| `pnpm db:status` | Print local API URL and keys |
| `pnpm db:reset` | Reset DB, re-run migrations + seed |

Auth callback route: `/auth/callback`  
Session refresh: `src/proxy.ts` (Next.js 16) via `src/lib/supabase/middleware.ts`

---

## Database migrations and seed data

Migrations live in [`supabase/migrations/`](supabase/migrations/).

| Migration | Contents |
| --- | --- |
| `20261106190000_create_profiles.sql` | `profiles`, role protection, signup trigger |
| `20261106200000_create_catalog_schema.sql` | Catalog taxonomies, tattoos, FTS, RLS, `tattoo-images` bucket |
| `20261107010000_create_favorites_collections_ai.sql` | Favorites, collections, AI generations/images + private AI storage bucket |
| `20261107020000_create_artists_admin_policies.sql` | Artists, consultations, admin AI read policies |

Seed file: [`supabase/seed.sql`](supabase/seed.sql) (synthetic demo artwork only — no scraped portfolios).

```bash
pnpm db:reset
```

Schema reference: [docs/database-schema.md](docs/database-schema.md)

---

## AI provider configuration

Text concepts use a provider interface with Gemini as the first concrete implementation.

| Env var | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-only Gemini API key (never exposed to the browser) |
| `IMAGE_GENERATION_ENABLED` | Must be `true` to even attempt AI images (still unavailable by default) |
| `HF_TOKEN` | Reserved for a future free image path; not required for core Studio |

**App rate limits (Postgres-backed):** 3 requests/minute and 10/day per user.

**Gemini free-tier note (checked 2026-11-07):** Google publishes limits per project/model in AI Studio; they are not guaranteed. Flash models are often ~5 RPM / ~20 RPD; Flash-Lite models are often higher. INKORA defaults to `gemini-2.5-flash-lite` and keeps stricter app caps. 429/quota surfaces as “try later”.

**Image generation note (checked 2026-11-07):** Hugging Face Inference Providers has no free monthly credits for free accounts. ZeroGPU Spaces are quota/queue fragile. INKORA ships an honest unavailable UI plus a licensed catalog-reference path that is never labeled AI-generated. No paid fallback.

---

## Local development commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest unit/component/integration tests |
| `pnpm test:integration` | Integration tests only (needs local Supabase env) |
| `pnpm test:e2e` | Playwright e2e |
| `pnpm check` | typecheck + lint + unit/integration tests |
| `pnpm format` | Prettier write |
| `pnpm db:start` | Start local Supabase |
| `pnpm db:stop` | Stop local Supabase |

---

## Testing

- Unit / component: Vitest + React Testing Library (`pnpm test`)
- E2E: Playwright (`pnpm test:e2e`)
- Critical user journeys for later phases are listed in [docs/development-phases.md](docs/development-phases.md)

---

## Build

```bash
pnpm build
pnpm start
```

---

## Vercel deployment

Target: **Vercel Hobby** + **Supabase Free**.

1. Create a Supabase project and run migrations from `supabase/migrations/` (`supabase db push` or SQL editor).
2. Seed carefully — `supabase/seed.sql` is for local demos; adapt for production.
3. In Vercel, import this repo and set environment variables from `.env.example` (production values only; never commit secrets).
4. Set `NEXT_PUBLIC_APP_URL` to the Vercel URL (or custom domain).
5. In Supabase Auth, add the production redirect URL: `https://YOUR_DOMAIN/auth/callback`.
6. Deploy. Confirm `/api/health`, `/tattoos`, and login.
7. Promote an admin only via trusted SQL / service role:

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-uuid>';
```

Optional: set `GEMINI_API_KEY` for live Studio text. Set `INKORA_AI_MOCK=true` only for demos/tests — never in production.

---

## Free-tier limitations

INKORA is designed to run without paid services for core features. Known constraints to plan around:

- **Supabase Free** may pause inactive projects.
- **Gemini free tier** (dated 2026-11-07): project/model limits vary in AI Studio; Flash often ~5 RPM / ~20 RPD. Prompts/outputs may be processed under Google’s generative AI terms (disclosed in Studio UI).
- **Hugging Face image path** (dated 2026-11-07): no free Inference Provider credits; ZeroGPU not treated as a reliable core dependency — image gen stays unavailable unless explicitly enabled later.
- **Vercel Hobby** has image optimization and function duration limits.

Nothing here promises unlimited free inference.

---

## Security considerations

Planned from day one (implemented across phases):

- Row Level Security on all user-accessible tables
- Server-verified admin permissions (never trust a client-supplied role)
- Zod validation on all inputs
- Secrets never exposed to the browser
- AI endpoints rate-limited at the application level
- Service-role key used only on the server

Details: [docs/architecture.md](docs/architecture.md)

---

## Known limitations

- AI image generation is unavailable by default (no reliable free HF path as of 2026-11-07)
- AI e2e uses `INKORA_AI_MOCK=true`; live Gemini requires `GEMINI_API_KEY`
- Consultation requests are stored only — no email/chat/booking pipeline
- Demo artists/tattoos are synthetic portfolio content, not scraped portfolios
- Local Supabase requires Docker Desktop
- Screenshots are not bundled; use the running app for visuals

---

## Future improvements

Tracked after the initial 18-phase release. Candidates include payments, messaging, richer artist tooling, and a body placement simulator — none are in scope for the first release.

---

## Documentation

| Document | Status |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | present |
| [docs/development-phases.md](docs/development-phases.md) | present |
| [docs/database-schema.md](docs/database-schema.md) | present |
| docs/product-specification.md | planned (later phase) |
| docs/api-reference.md | planned (Phase 8) |

---

## License

To be decided before public release.
