---
description: "This rule contains our recommended Sanity GROQ and Zod beta implementation approach for our data transformation layer"
alwaysApply: true
---

## 1. Purpose

The DTL is the boundary between Sanity's Content Lake and the frontend application. It is the single location where GROQ queries are defined, responses are validated, data is transformed, and TypeScript types are generated.

Components never receive raw Sanity data. Components never handle nullability from Sanity. Components never import from `sanity.types.ts` directly.

## 2. Design Principles

1. **Frontend contract over document schema.** Zod schemas define what the frontend expects, not what Sanity stores. Document schemas are irrelevant to the DTL.
2. **Co-location.** Every GROQ fragment/query is co-located with its Zod schema in a single `{ groq, schema }` export.
3. **Field-level defaults.** Required fields use `.default()` to provide safe fallback values. Optional fields use `.nullable()` or `.optional()`. No object-level `.catch()`.
4. **Single fetch path.** All data flows through `sanityFetch()`, which validates every response. There is no unvalidated path.
5. **No over-fetching.** Queries project only consumed fields. Never use `...` (spread) projections.
6. **Composition over inheritance.** Fragments compose into queries. Queries do not extend or inherit from base types.

## 3. Architecture

```
lib/dtl/
├── fetch.ts                  # sanityFetch wrapper
├── helpers.ts                # defineFragment, shared Zod utilities
├── fragments/                # Reusable field-level fragments
│   ├── image.ts
│   ├── link.ts
│   ├── seo.ts
│   └── ...
├── portable-text/            # PT validation schemas
│   ├── base.ts               # span, block, oneLine
│   ├── marks.ts              # link, internalLink, custom marks
│   ├── blocks.ts             # Custom inline blocks (cta, image, code)
│   └── presets.ts            # Composed PT schemas (bodyPT, oneLinePT)
├── page-builder/             # Page builder block definitions
│   ├── blocks/
│   │   ├── hero.ts
│   │   ├── text-section.ts
│   │   └── ...
│   └── index.ts              # Discriminated union of all blocks
├── references/               # Reference card fragments (article card, etc.)
│   ├── article-card.ts
│   └── ...
└── queries/                  # Page-level query compositions
    ├── article.ts
    ├── home.ts
    └── ...
```

## 4. Core Constructs

### 4.1 Fragment

A fragment is a `{ groq: string, schema: z.ZodType }` pair representing a reusable set of projected fields.

```tsx
// fragments/image.ts
export const imageFragment = {
  groq: `
    "url": asset->url,
    "alt": coalesce(alt, ""),
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  `,
  schema: defineFragment({
    url: z.string(),
    alt: z.string().default(""),
    width: z.number().default(0),
    height: z.number().default(0),
  }),
};

export type Image = z.infer<typeof imageFragment.schema>;
```

### 4.2 Query

A query composes fragments and defines the full GROQ string + Zod schema for a page or endpoint.

```tsx
// queries/article.ts
export const articleQuery = {
  groq: defineQuery(`
    *[_type == "article" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      publishedAt,
      "heroImage": heroImage{ ${imageFragment.groq} },
      ${seoFragment.groq},
      body[]{ ${bodyPTPreset.groq} }
    }
  `),
  schema: z.object({
    title: z.string().default(""),
    slug: z.string(),
    publishedAt: z.string().transform((d) => new Date(d)),
    heroImage: imageFragment.schema.nullable().default(null),
    ...seoFragment.schema.shape,
    body: bodyPTPreset.schema,
  }),
};

export type Article = z.infer<typeof articleQuery.schema>;
```

### 4.3 Reference Fragment

A reference fragment defines the shape of a document when referenced from another context (e.g., article card in a list, author byline). It is structurally identical to a fragment but semantically represents a document summary.

```tsx
// references/article-card.ts
export const articleCardFragment = {
  groq: `
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    "thumbnail": thumbnail{ ${imageFragment.groq} }
  `,
  schema: defineFragment({
    _type: z.literal("article"),
    title: z.string().default(""),
    slug: z.string(),
    publishedAt: z.string().transform((d) => new Date(d)),
    thumbnail: imageFragment.schema.nullable().default(null),
  }),
};
```

### 4.4 Page Builder Block

Each block is a `{ groq, schema }` pair with a `_type` literal discriminator.

```tsx
// page-builder/blocks/hero.ts
export const heroBlock = {
  groq: `
    _type == "hero" => {
      _type, _key,
      heading,
      "backgroundImage": backgroundImage{ ${imageFragment.groq} }
    }
  `,
  schema: z.object({
    _type: z.literal("hero"),
    _key: z.string(),
    heading: z.string().default(""),
    backgroundImage: imageFragment.schema.nullable().default(null),
  }),
};
```

The page builder union is composed in `page-builder/index.ts`:

```tsx
export const pageBuilderSchema = z
  .array(
    z.discriminatedUnion("_type", [
      heroBlock.schema,
      textSectionBlock.schema,
      galleryBlock.schema,
    ]),
  )
  .default([]);

export const pageBuilderGroq = `
  sections[]{
    _type, _key,
    ${heroBlock.groq},
    ${textSectionBlock.groq},
    ${galleryBlock.groq}
  }
`;
```

### 4.5 Portable Text

### Base structures

```tsx
// portable-text/base.ts
export const ptSpan = z.object({
  _type: z.literal("span"),
  _key: z.string(),
  text: z.string().default(""),
  marks: z.array(z.string()).default([]),
});

export const ptBlock = z.object({
  _type: z.literal("block"),
  _key: z.string(),
  style: z.string().default("normal"),
  children: z.array(ptSpan).default([]),
  markDefs: z.array(z.any()).default([]),
  listItem: z.string().optional(),
  level: z.number().optional(),
});
```

### Custom marks (validated because renderers depend on their shape)

```tsx
// portable-text/marks.ts
export const ptLinkMark = z.object({
  _type: z.literal("link"),
  _key: z.string(),
  href: z.string(),
});

export const ptInternalLinkMark = z.object({
  _type: z.literal("internalLink"),
  _key: z.string(),
  slug: z.string(),
  docType: z.string(),
});
```

### Custom blocks

```tsx
// portable-text/blocks.ts
export const ptImageBlock = z.object({
  _type: z.literal("image"),
  _key: z.string(),
  ...imageFragment.schema.shape,
});

export const ptCtaBlock = z.object({
  _type: z.literal("cta"),
  _key: z.string(),
  label: z.string().default(""),
  url: z.string().default("#"),
  variant: z.enum(["primary", "secondary"]).default("primary"),
});
```

### Presets

```tsx
// portable-text/presets.ts

// Full body field with custom blocks and marks
export const bodyPTPreset = {
  groq: `
    ...,
    _type == "image" => { _type, _key, ${imageFragment.groq} },
    _type == "cta" => { _type, _key, label, url, variant },
    _type == "block" => {
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          _type, _key,
          "slug": @.reference->slug.current,
          "docType": @.reference->_type
        }
      }
    }
  `,
  schema: z
    .array(
      z.discriminatedUnion("_type", [
        ptBlock.extend({
          markDefs: z
            .array(
              z.discriminatedUnion("_type", [ptLinkMark, ptInternalLinkMark]),
            )
            .default([]),
        }),
        ptImageBlock,
        ptCtaBlock,
      ]),
    )
    .default([]),
};

// Single-line rich text (no blocks, no lists)
export const oneLinePTPreset = {
  groq: `...`,
  schema: z
    .array(
      ptBlock.extend({
        style: z.literal("normal"),
        listItem: z.undefined(),
      }),
    )
    .max(1)
    .default([]),
};
```

## 5. Fetch Layer

```tsx
// fetch.ts
import { client } from "./client";

export async function sanityFetch<T extends z.ZodType>(
  queryDef: { groq: string; schema: T },
  params?: Record<string, unknown>,
): Promise<z.output<T>> {
  const raw = await client.fetch(queryDef.groq, params);
  return queryDef.schema.parse(raw);
}
```

All consuming code calls `sanityFetch(articleQuery, { slug })` and receives a fully validated, transformed, typed result.

## 6. Type Generation

Types are derived from Zod schemas via `z.infer` / `z.output`. Every fragment and query exports its inferred type:

```tsx
export type Image = z.infer<typeof imageFragment.schema>;
export type Article = z.infer<typeof articleQuery.schema>;
```

Components import these types. Components never construct their own types from Sanity data.

## 7. Nullability Rules

| Category                                         | Zod pattern                               | Component behavior                              |
| ------------------------------------------------ | ----------------------------------------- | ----------------------------------------------- |
| Required field, always present in published data | `z.string().default("")`                  | Renders value; shows empty/placeholder in draft |
| Optional field, may be absent in published data  | `z.string().nullable()` or `.optional()`  | Conditional render: `{value && <Component />}`  |
| Required object (e.g., hero image)               | `fragmentSchema.nullable().default(null)` | Conditional render block                        |
| Array field                                      | `z.array(...).default([])`                | Always iterable; empty = nothing rendered       |

Draft mode and production mode use the **same fetch path and same schemas**. Field-level defaults ensure components render progressively during live preview without separate conditional logic.

## 8. Sanity TypeGen Integration

TypeGen remains in the project for two purposes:

1. **GROQ syntax validation.** `defineQuery()` enables editor syntax highlighting and TypeGen's static analysis.
2. **Cross-check.** TypeGen's generated result types serve as a secondary check against Zod schemas. If TypeGen says a field is `number | null` and Zod says `z.string()`, that discrepancy is a signal to investigate.

TypeGen types are never imported by application code. They are a development-time safety net only.

## 9. `defineFragment` Helper

```tsx
// helpers.ts
import { z } from "zod";

type FragmentShape = Record<string, z.ZodTypeAny>;

export function defineFragment<T extends FragmentShape>(shape: T) {
  const schema = z.object(shape);
  if (process.env.NODE_ENV === "development") {
    return schema.strict() as z.ZodObject<T>;
  }
  return schema;
}
```

`strict()` in development rejects unexpected keys from GROQ responses, catching GROQ-Zod drift early. In production, strict mode is disabled to avoid breaking on benign extra fields.

## 10. Error Handling

- `sanityFetch` throws `ZodError` on validation failure.
- In development: log the full `ZodError` with field paths for debugging.
- In production: catch at the page level, report to error tracking, render error boundary.
- Never silently swallow validation errors. A schema mismatch in production indicates data integrity issues that must be investigated.
