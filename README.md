# Ignite for Sanity

A Sanity starter kit providing modern, clean designs for your content-driven websites. Built with Next.js 16, Tailwind CSS 4, and Sanity 4.

Out of the box it includes schema for pages, posts, categories, authors, and global settings. Pages are structured with a page builder that lets you compose a number of components: hero, CTA, post list, subscribe, content, etc.

## Key Dependencies

- Next.js 16 (App Router, `use cache`, Partial Pre-Rendering)
- Sanity 4 + next-sanity 11
- Tailwind CSS 4
- Shadcn/ui
- nuqs (URL state management)
- Zod (runtime validation)
- Valibot (env validation)
- Biome (linting + formatting)
- Vitest (testing)
- TypeScript 5

## Getting Started

### 1. Initialize template with Sanity CLI

```bash
npm create sanity@latest -- --template 10up/sanity-ignite
```

This will install your NPM dependencies and populate the `.env.local` file.

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Open the Project and sign in to Sanity

Open the next app locally at [http://localhost:3000](http://localhost:3000) and the Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio).

## Architecture

### Data Fetching

All Sanity data flows through a unified fetch layer (`src/lib/sanity/client/fetch.ts`):

```
Route -> sanityFetch({ query, schema, cache }) -> Zod validation -> Component
```

- **Published content** uses Next.js `use cache` with configurable `cacheLife` profiles and `cacheTag` for granular revalidation
- **Draft mode** falls through to `SanityLive` for real-time preview
- Every query result is validated against a Zod schema before reaching components

### Caching & Revalidation

Cache is tag-based. Each `sanityFetch` call declares its tags (e.g. `sanity:type:post`, `sanity:slug:my-post`). Revalidation happens via:

1. **Webhook endpoint** (`/api/revalidate`) — Sanity sends a webhook on content changes, which calls `revalidateTag()` for the affected document type and slug
2. **Time-based** — `cacheLife` profiles (`hours`, `days`, etc.) set the TTL

### Blog Filtering & Pagination

The `/blog` route uses [nuqs](https://nuqs.47ng.com/) for URL state management:

- `?category=slug` — filter by category
- `?search=term` — search by title
- `?sort=oldest` — sort order (default: `recent`)
- `?page=2` — pagination

The static shell (title, filter controls) renders instantly via PPR. Filtered results stream in through `<Suspense>` with a skeleton fallback. Author and category archive pages use `?page=N` query params for pagination.

### Type Generation

Sanity TypeGen generates TypeScript types from your schema and GROQ queries:

```bash
npm run sanity:typegen
```

Types are written to `.sanity/sanity.types.ts` and used throughout the frontend. The `dev` script watches for schema/query changes and regenerates automatically.

## Folder Structure

```
src/
  app/
    (frontend)/          # Frontend routes
      [slug]/            # Dynamic pages (page builder)
      author/[personSlug]/ # Author archive
      blog/              # Blog index with nuqs filtering
      blog/[slug]/       # Individual post
      category/[categorySlug]/ # Category archive
    api/
      draft-mode/enable/ # Visual editing draft mode
      revalidate/        # Webhook revalidation endpoint
    studio/              # Embedded Sanity Studio
  components/
    icons/               # Custom SVG/icon components
    layout/              # Header, Footer, MobileNav, etc.
    modules/             # Components that receive Sanity data
    sections/            # Page builder sections
    templates/           # Page-level templates
    ui/                  # Presentational UI (no side effects)
  env/                   # Environment variable validation
  hooks/                 # Custom React hooks
  lib/
    sanity/
      client/            # Sanity client, fetch layer, SEO utils
      queries/           # GROQ queries + Zod schemas
  studio/
    schema/              # Sanity schema definitions
    components/          # Custom Studio components
    structure/           # Custom Studio structure
  utils/                 # Utility functions
```

### Component Categories

- **`ui/`** — Pure presentational components. No Sanity types, no data fetching, no global state.
- **`modules/`** — Accept Sanity data as props. May call server actions but don't fetch directly.
- **`sections/`** — Page builder sections rendered by `PageSections` via a component map.
- **`templates/`** — Page-level layout wrappers shared across routes.

## Environment Variables

### Setup

```sh
cp .env.example .env.local
```

### Files

| File | Purpose |
| --- | --- |
| `.env.local` | Local dev secrets (git-ignored) |
| `.env.example` | Template with required variable names |
| `.env.test` | Variables for unit tests |

### Adding Variables

1. Add to `.env.example`
2. Add validation in `src/env/serverEnv.ts` (private) or `src/env/clientEnv.ts` (public)
3. Access via `serverEnv.MY_VAR` or `clientEnv.NEXT_PUBLIC_MY_VAR`

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
npm run lint        # Check
npm run lint:fix    # Fix
npm run format      # Check formatting
npm run format:fix  # Fix formatting
npm run check       # Both
```

### Bundle Analysis

```bash
ANALYZE=true npm run next:build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity)
- [nuqs Documentation](https://nuqs.47ng.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
