# INKORA

**Discover your next tattoo. Give your ideas meaning.**

INKORA is an AI-powered tattoo discovery and inspiration platform. It helps people find tattoo designs, explore styles and placements, save favorites, build collections, and generate personalized tattoo concepts with AI.

This repository is a portfolio-grade full-stack application. Development follows an incremental, phase-based process. Features are documented only after they exist.

---

## Current status

**Phases 1–10 complete — foundation through authentication UI**

Shipping surface now includes catalog data-access, marketing landing, gallery search/filters, tattoo detail pages, and auth (register / login / reset / account). Favorites and collections come next.

Next step: **Phase 11 — Favorites** (requires explicit approval).

See [docs/development-phases.md](docs/development-phases.md) for the full 18-phase roadmap.

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
| Tattoo discovery gallery | P1 | planned |
| Search and filtering | P1 | planned |
| Tattoo detail pages | P1 | planned |
| Authentication | P1 | planned |
| Favorites | P1 | planned |
| Personal collections | P1 | planned |
| AI tattoo concept generation | P2 | planned |
| AI concept refinement | P2 | planned |
| Optional AI image generation | P2 | planned |
| Admin dashboard | P2 | planned |
| Artist discovery and profiles | P3 | planned |
| Consultation requests (store only) | P3 | planned |

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

Seed file: [`supabase/seed.sql`](supabase/seed.sql) (synthetic demo artwork only — no scraped portfolios).

```bash
pnpm db:reset
```

Schema reference: [docs/database-schema.md](docs/database-schema.md)

---

## AI provider configuration

> Not available yet. Provider interfaces and configuration will be added in **Phases 13–15**. Image generation remains optional and never falls back to a paid provider.

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

> Not available yet. Deployment instructions for Vercel Hobby will be completed in **Phase 18**.

---

## Free-tier limitations

INKORA is designed to run without paid services for core features. Known constraints to plan around:

- **Supabase Free** may pause inactive projects.
- **Gemini free tier** has rate and quota limits that can change; prompts may be used under Google’s free-tier data terms (disclose in the UI when AI ships).
- **Hugging Face ZeroGPU** is optional, subject to quota and cold starts, and may exceed serverless timeouts.
- **Vercel Hobby** has image optimization and function duration limits.

Limits will be verified and dated when each integration is implemented. Nothing here promises unlimited free inference.

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

- Catalog UI, auth forms, AI, and admin features are not implemented yet (placeholder routes / infra only)
- Screenshots will be added after richer UI phases
- Product specification, database schema, and API reference docs are created in the phases that produce their content
- Local Supabase requires Docker Desktop running

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
