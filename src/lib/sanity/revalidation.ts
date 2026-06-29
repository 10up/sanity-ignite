import 'server-only';
import { defineQuery } from 'next-sanity';

/**
 * Single source of truth for webhook-driven, tag-based revalidation.
 *
 * The read side (`sanityFetch({ tags })`) and the write side (the
 * `/api/revalidate` webhook) MUST agree on tag strings, so both live here:
 *
 *  - `tag.*`                      → the tag builders the read side uses.
 *  - `getRevalidateTags(payload)` → the fan-out the webhook uses to turn one
 *                                   changed document into every tag that needs
 *                                   purging (including tags for *other* types
 *                                   that embed this document).
 *
 * The GROQ filter + projection that configure the Sanity webhook itself live in
 * `src/lib/sanity/webhooks/revalidate.groq` (copy/paste into sanity.io/manage).
 *
 * Tag conventions:
 *  - `sanity:type:<_type>`      everything that reads documents of a type.
 *  - `sanity:slug:<slug>`       a single page keyed by its slug.
 *  - `sanity:category:<slug>`   a category landing page + its article list.
 */

/** Tag builders — import these on the read side so tags never drift. */
export const tag = {
  type: (type: string) => `sanity:type:${type}`,
  slug: (slug: string) => `sanity:slug:${slug}`,
  category: (slug: string) => `sanity:category:${slug}`,
} as const;

/** Shape the webhook delivers — see `webhooks/revalidate.groq`. */
export type RevalidatePayload = {
  _type: string;
  _id?: string;
  slug?: string | null;
  /** Slugs of the categories an article references (articles only). */
  categorySlugs?: (string | null)[] | null;
};

/**
 * Turn one changed document into the full set of cache tags to purge.
 *
 * The base tags (`type:<_type>` + the document's own `slug:`) cover the
 * document's own surfaces. The per-type branches add the tags of *other*
 * surfaces that embed this document, so edits propagate across references.
 */
export function getRevalidateTags(body: RevalidatePayload): string[] {
  const tags = new Set<string>([tag.type(body._type)]);

  if (body.slug) {
    tags.add(tag.slug(body.slug));
  }

  switch (body._type) {
    case 'article':
      // Articles are embedded in the home page builder (hero + article list).
      tags.add(tag.type('homePage'));
      // ...and listed on each of their category landing pages.
      for (const categorySlug of body.categorySlugs ?? []) {
        if (categorySlug) tags.add(tag.category(categorySlug));
      }
      break;

    case 'category':
      // The category label/slug is embedded on every article card.
      tags.add(tag.type('article'));
      // The category landing page (hero + list) keys off this tag.
      if (body.slug) tags.add(tag.category(body.slug));
      break;

    default:
      break;
  }

  return [...tags];
}

// =============================================================================
// Sanity webhook config — content revalidation
// =============================================================================
// Drives the `/api/revalidate` endpoint. Create a GROQ-powered webhook at
// sanity.io/manage (API → Webhooks) and copy the two blocks below into the
// matching fields. Tag fan-out (which document type purges which cache tags)
// lives in `src/lib/sanity/revalidation.ts`.
//
// Webhook settings:
//   - URL:         https://<your-domain>/api/revalidate
//   - HTTP method: POST
//   - Trigger on:  Create, Update, Delete
//   - Secret:      same value as SANITY_WEBHOOK_SECRET in your env
//   - API version: v2025-02-19 (or later)
//
// Docs: https://www.sanity.io/docs/content-lake/webhooks
// =============================================================================

// --- Filter ------------------------------------------------------------------
// Only fire for the document types we render or that are embedded in rendered
// content (person → author byline, category → article labels).

export const filter = defineQuery(
  `_type in ["settings", "homePage", "page", "article", "category"]`
);

// --- Projection --------------------------------------------------------------
// Shapes the delivered payload to exactly what `getRevalidateTags` consumes.
// `categorySlugs` resolves to null for non-article documents (fine). On delete
// events this projects the document's last-known state.

export const projection = defineQuery(`{
  "_type": _type,
  "_id": _id,
  "slug": slug.current,
  "categorySlugs": categories[]->slug.current
}`);
