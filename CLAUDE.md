# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Caawi is a mentorship platform by Somalis in Tech, connecting mentors and mentees. Built with Next.js 14 (App Router), Supabase Auth, Prisma ORM, and shadcn/ui.

## Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build
pnpm lint             # TypeScript check + ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm check-types      # TypeScript only
pnpm migrate          # Prisma migrate dev
pnpm studio           # Prisma Studio GUI
pnpm generate         # Regenerate Prisma client
pnpm seed             # Seed database (100 fake users)
```

Secrets are managed via **Doppler** (project: `caawi`, config: `dev`). Run `doppler setup` for first-time config. Use `doppler run -- <command>` to inject secrets into commands.

## Architecture

### Routing (App Router with grouped routes)

- `(marketing)/` — Public pages: home, mentor listing
- `(dashboard)/dashboard/` — Protected routes: mentor browsing, profile editing
- `(auth)/auth/` — Login page (email OTP + OAuth)
- `(notifications)/` — Transactional: check-email, error pages
- `api/` — API routes: auth callbacks, calendly integration, mentors, users

`middleware.ts` protects `/dashboard/*` and `/api/*` by refreshing the Supabase session.
`/dashboard` rewrites to `/dashboard/mentors` via `next.config.js`.

### Authentication

Uses **Supabase Auth** (not NextAuth — `NEXTAUTH_*` env vars are legacy). Two sign-in methods:

1. **Email OTP** — `signInWithOtp()` → redirects to `/check-email`
2. **OAuth** — Google, GitHub, LinkedIn, Twitter via `signInWithOAuth()` → `/api/auth/callback`

Three Supabase client variants:
- `utils/supabase/client.ts` — Browser client
- `utils/supabase/server.ts` — Server client (cookies)
- `utils/supabase/middleware.ts` — Session refresh

### Database Triggers (critical)

Three PostgreSQL triggers sync `auth.users` ↔ `public.User`:

- **`on_auth_user_created`** — When a user signs up via Supabase Auth, auto-creates a `User` + `Profile` row, extracting name/avatar from OAuth metadata
- **`on_auth_user_deleted`** — Deleting from `auth.users` cascades to `public.User`
- **`on_public_user_deleted`** — Deleting from `public.User` cascades back to `auth.users`

Source SQL lives in `prisma/triggers/`. These must be applied manually after migrations (not managed by Prisma).

### Data Layer

**Prisma** with PostgreSQL (Supabase). Two connection strings:
- `DATABASE_URL` — PgBouncer pooler (port 6543) for app queries
- `DIRECT_URL` — Direct connection (port 5432) for migrations

Key models: `User` → `Profile` (1:1) → `Location`, `Occupation`, `CalendlyUser`, `Skill` (M:M).
`MentorProfile` is a **SQL view** (read-only, denormalized mentor data). Source in `prisma/views/public/MentorProfile.sql`.

Prisma client singleton at `lib/db.ts`. Preview feature `views` is enabled.

### API Routes

API routes use the `withAxiom` wrapper for structured logging. Pattern: authenticate via Supabase server client, then query with Prisma. Profile updates use `connectOrCreate` for Location/Occupation upserts.

### Component Patterns

- **shadcn/ui** (Radix UI + Tailwind) in `components/ui/`
- Forms use **React Hook Form** + **Zod** schemas + shadcn form primitives
- `cn()` utility from `lib/utils.ts` for class merging (clsx + tailwind-merge)
- Server Components by default; `'use client'` only for interactive elements
- Providers in `providers/index.ts`: ThemeProvider, PostHogProvider, Toaster

## Conventions

- **Path alias**: `@/*` maps to project root
- **Commit format**: Conventional commits with optional JIRA ID — `feat(auth): add OAuth (CAAWI-123)`
- **Pre-commit**: Husky runs lint-staged (ESLint --fix + Prettier) on staged files
- **Styling**: Tailwind utility-first, HSL CSS variables for theming, dark mode via class
- **Prettier**: 120 char width, single quotes, no trailing commas
