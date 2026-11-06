# INKORA Product Specification

Last updated: Phase 18 (full roadmap complete).

## Product

INKORA is a portfolio-grade tattoo discovery and inspiration platform:

- Browse and filter a curated tattoo catalog
- Save favorites and organize collections
- Generate / refine text tattoo concepts with AI (Gemini free tier)
- Discover demo artist profiles and store consultation requests (no messaging)

Tagline: **Discover your next tattoo. Give your ideas meaning.**

## Personas

1. Tattoo enthusiasts seeking inspiration
2. First-time tattoo seekers
3. People exploring styles/placements before booking
4. Artists showcasing work (directory + store-only consultation intake)
5. Admins managing catalog metadata

## In scope (shipped)

- Public gallery, search/filters, detail pages
- Auth (register / login / reset / account)
- Favorites and collections with RLS
- AI Studio text concepts, refine, history, optional unavailable image path
- Admin catalog/taxonomy/upload metadata + AI metrics
- Artist directory, profiles, consultation storage

## Out of scope

- Payments / subscriptions
- Real-time messaging or booking confirmations
- Full 3D body simulator
- Paid AI fallbacks

## Critical journeys

Documented and covered in Playwright (or integration where noted) in `docs/development-phases.md`.
