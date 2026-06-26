# Ignite for Sanity

A Sanity starter kit providing modern, clean designs for your content-driven websites. Built with Next.js 16, Tailwind CSS 4, and Sanity 5.

Out of the box it includes schema for articles, pages, categories, and authors, plus singletons for the home page, article archive, and global settings. Pages are composed with a page builder whose sections (hero, media + text, article list) are rendered through a component map.

## Key Dependencies

- Next.js 16 (App Router, `use cache`, Cache Components)
- Sanity 5 + next-sanity 13
- Tailwind CSS 4
- shadcn/ui (Radix UI primitives)
- Zod (runtime + env validation)
- AI SDK (`@ai-sdk/anthropic`) for the streamed search overview
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
Route -> sanityFetch({ query, schema, tags, perspective, stega }) -> Zod validation -> Component
```

- Every query result is validated against a **Zod schema** before reaching components.
- `tags` are semantic, webhook-driven cache tags (e.g. `sanity:type:article`, `sanity:slug:my-post`) forwarded to `cacheTag()`.
- `perspective` and `stega` are **request-time** values resolved by `getDynamicFetchOptions()` (`src/lib/sanity/client/live.ts`) and passed in as serializable props.

#### The three-layer pattern (Cache Components)

Next.js Cache Components forbid request-time data (cookies, `draftMode()`) inside a `'use cache'` boundary, so `sanityFetch` **must** be called from inside one. Routes resolve this with three layers (see `src/app/(frontend)/page.tsx`):

1. **Orchestrator** — branches on `draftMode()`. The published branch prerenders a static shell; the draft branch streams a dynamic render.
2. **Dynamic layer** — resolves `perspective`/`stega`/cookies *outside* any cache boundary.
3. **Cached layer** — `'use cache'`, receives serializable props, fetches, and renders.

This is what lets Sanity Live + Visual Editing coexist with Cache Components. `defineLive({ strict: true })` enforces that `perspective` and `stega` are always supplied.

### Rendering Model

- **Static-first** — published pages prerender as a static shell.
- **Streaming** — slower or request-specific content streams in through `<Suspense>` with skeleton fallbacks.
- **Personalization slots** — `RecommendedArticleList` is a dynamic island: it reads the `x-user-country` cookie at request time and is slotted in as `children` inside the cached feed, so the page stays cached while the personalized list streams in. Recommendations are ranked in GROQ with `score($country in countryInterest)`. Wire your edge layer (e.g. a geo header) to the `x-user-country` cookie at deploy time; the allow-list lives in `src/lib/fixtures/countries.ts`.

### Search

Article search is exposed as two route handlers backed by one cached helper (`src/lib/sanity/client/search.ts`):

- **`GET /api/search?q=`** — semantic search over the Sanity **dataset embeddings** index using `text::semanticSimilarity()`. Requires embeddings to be enabled on the dataset (`npm run embeddings:enable`).
- **`POST /api/search/overview`** — streams a short, LLM-generated overview of the results via the AI SDK (Anthropic, Haiku 4.5 by default). Defended with a same-origin guard, per-IP rate limit, and server-authoritative inputs; degrades gracefully (`204`) when `ANTHROPIC_API_KEY` is absent.

Both routes call the same `'use cache'` helper with the same term, so they share one cache entry. The search UI (`src/components/modules/SiteSearch.tsx`) debounces input and cancels stale requests with `AbortController`.

### Caching & Revalidation

Cache is tag-based. Each `sanityFetch` call declares its tags using the builders in `src/lib/sanity/revalidation.ts`. Revalidation happens via:

1. **Webhook endpoint** (`/api/revalidate`) — Sanity sends a webhook on content changes; `getRevalidateTags()` maps the changed document to every affected cache tag (including tags for content that _embeds_ it, e.g. an article edit also revalidates the home page builder and its category pages) and calls `revalidateTag()` for each.
2. **Time-based** — `cacheLife` profiles set the TTL. The default is next-sanity's `sanity` preset (`next.config.ts`), since on-demand webhook revalidation makes the stock 15-minute window too aggressive.

#### Configuring the Sanity webhook

The fan-out lives in code (`src/lib/sanity/revalidation.ts`), but the webhook that delivers the payload is configured in Sanity. Create a [GROQ-powered webhook](https://www.sanity.io/docs/content-lake/webhooks) at [sanity.io/manage](https://www.sanity.io/manage) (API → Webhooks) and copy the exported **`filter`** and **`projection`** blocks from `src/lib/sanity/revalidation.ts` into the matching fields. Set:

- **URL** — `https://<your-domain>/api/revalidate`
- **HTTP method** — `POST`
- **Trigger on** — Create, Update, Delete
- **Secret** — the same value as `SANITY_WEBHOOK_SECRET` in your env

The projection shapes the payload to exactly what `getRevalidateTags()` expects, so the two stay in sync.

### Agent Readiness

The site publishes machine-readable surfaces so agents can read its content without scraping HTML (see `src/lib/agent-readiness/` and the `src/app/(agent-readiness)/` route group):

- **`/llms.txt`** — a curated Markdown index of the most important content.
- **`/feed.xml`** and **`/feed.json`** — RSS 2.0 and JSON Feed 1.1 of the latest articles.
- **`/.well-known/agent-skills/`** — the site publishes its own Agent Skill (`SKILL.md`) plus a discovery index.
- **schema.org JSON-LD** — embedded in each page's server-rendered HTML, with entities linked by `@id`.
- **Discovery `Link` headers** — every response advertises the above via RFC 8288 `Link` headers (`next.config.ts`).
- **`robots.ts`** — per-vendor AI crawler rules (opt out of training crawlers, opt in to retrieval crawlers).

### Type Generation

Sanity TypeGen generates TypeScript types from your schema and GROQ queries:

```bash
npm run sanity:typegen
```

This extracts the schema to `.sanity/schema.json` and writes types to `.sanity/sanity.types.ts` (configured in `sanity.cli.ts`). TypeGen also runs automatically as part of `npm run next:build`; re-run `npm run sanity:typegen` after changing schema or queries during development.

## Folder Structure

```
src/
  actions/               # Server actions (newsletter subscribe, draft mode)
  app/
    (frontend)/          # Frontend routes
      [slug]/            # Dynamic pages (page builder)
      article/[slug]/    # Individual article
      category/[...slug]/ # Category + subcategory archives
      layout.tsx         # Frontend layout (SanityLive, Visual Editing)
    (agent-readiness)/   # llms.txt, feeds, agent-skills route group
    api/
      draft-mode/enable/ # Visual editing draft mode
      revalidate/        # Webhook revalidation endpoint
      search/            # Semantic search + streamed AI overview
    studio/              # Embedded Sanity Studio
    robots.ts            # robots.txt (incl. AI crawler rules)
    sitemap.ts           # sitemap.xml
  components/
    icons/               # Custom SVG/icon components
    layout/              # Header, Footer, MobileNav, etc.
    modules/             # Components that receive Sanity data
    sections/            # Page builder + page sections
    seo/                 # JSON-LD components
    templates/           # Page-level templates
    ui/                  # Presentational UI (incl. shadcn/)
  env/                   # Environment variable validation (Zod)
  hooks/                 # Custom React hooks
  lib/
    agent-readiness/     # llms.txt / feeds / JSON-LD / skill builders
    sanity/
      client/            # Sanity client, fetch/live layer, search, SEO utils
      queries/           # GROQ queries, fragments + Zod schemas
      revalidation.ts    # Tag builders + webhook fan-out (filter/projection)
  studio/
    schema/              # Sanity schema (documents, singletons, objects, embeddings)
    components/          # Custom Studio input components
    structure/           # Custom Studio structure
    actions/             # Custom document actions (e.g. publish with read time)
  utils/                 # Utility functions
```

### Component Categories

- **`ui/`** — Pure presentational components. No Sanity types, no data fetching, no global state. Includes vendored `shadcn/` components.
- **`modules/`** — Accept Sanity data as props. May call server actions but don't fetch directly.
- **`sections/`** — Page builder sections rendered by `PageSections` via a component map, plus other page-level sections.
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

## Semantic Search Setup

Semantic search relies on a Sanity **dataset embeddings** index scoped to articles (`src/studio/schema/embeddings/projection.ts`):

```bash
npm run embeddings:enable   # enable embeddings with the article projection
npm run embeddings:status   # check indexing status
```

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
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Dataset Embeddings](https://www.sanity.io/docs/content-lake/dataset-embeddings)
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity)
- [AI SDK Documentation](https://ai-sdk.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
