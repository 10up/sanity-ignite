import { pathToFileURL } from 'node:url';

/**
 * Dataset embeddings projection for semantic search over articles.
 *
 * A projection defines *what content gets embedded* for a dataset. Scoping it to
 * only the fields users actually search against keeps the vector space focused,
 * speeds up generation/recompute, and improves result relevance.
 * Learn more: https://www.sanity.io/docs/content-lake/dataset-embeddings
 *
 * This is a type-specific projection: only `_type == "article"` is listed, so
 * only articles are embedded. Document types not present here are skipped.
 *
 * IMPORTANT — reference limitation:
 * Dataset embedding projections operate on the raw document only; references are
 * NOT dereferenced ("only what's in the document"). On `article`, both `author`
 * and `categories` are references, so their text (author name, category title)
 * is not reachable here. To make author/category searchable, denormalize the
 * values onto the article (e.g. write `authorName`/`categoryTitles` via a Sanity
 * Function on publish) and add them to this projection.
 *
 * Field names are preserved as semantic context during embedding, so we give
 * each value a descriptive key.
 */
export const articleEmbeddingsProjection = /* groq */ `{
  _type == "article" => {
    title,
    "summary": excerpt,
    "metaTitle": seo.metaTitle,
    "metaDescription": seo.metaDescription,
    "keywords": seo.seoKeywords,
    "content": pt::text(content)
  }
}`;

/**
 * Print the projection to stdout when run directly so it can be piped into the
 * Sanity CLI. Requires Node >= 22 (native TypeScript support); otherwise run it
 * with `npx tsx`.
 *
 * Enable embeddings on a new or existing dataset:
 *
 *   sanity datasets embeddings enable "$DATASET" \
 *     --projection "$(node src/studio/schema/embeddings/projection.ts)"
 *
 * Or via the npm script:
 *
 *   npm run embeddings:projection
 */
const invokedDirectly =
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  process.stdout.write(articleEmbeddingsProjection);
}
