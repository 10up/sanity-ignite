import 'server-only';

import { searchArticlesQuery } from '@/lib/sanity/queries/queries';
import { searchResultsSchema } from '@/lib/sanity/queries/schemas';
import { sanityFetch } from './fetch';

/**
 * Cached article search shared by GET /api/search and POST /api/search/overview.
 *
 * Because both routes call this single `'use cache'` function with the same
 * `searchTerm`, they share one cache entry — a warm cache makes the overview's
 * re-fetch effectively free. Search is a public, idempotent read, so it always
 * runs as published content with stega disabled.
 */
export async function searchArticles(searchTerm: string) {
  'use cache';
  return sanityFetch({
    query: searchArticlesQuery,
    params: { searchTerm },
    schema: searchResultsSchema,
    tags: ['sanity:type:article'],
    perspective: 'published',
    stega: false,
  });
}
