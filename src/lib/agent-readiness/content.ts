import 'server-only';

import { z } from 'zod';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  allCategoriesQuery,
  latestArticlesQuery,
  navPagesQuery,
  settingsQuery,
} from '@/lib/sanity/queries/queries';
import {
  allCategoriesSchema,
  articleCardSchema,
  navPagesSchema,
  settingsSchema,
} from '@/lib/sanity/queries/schemas';

// How many articles to surface in machine-readable indexes (llms.txt, feeds).
export const AGENT_FEED_SIZE = 50;

const articleListSchema = z.array(articleCardSchema);

/**
 * Always-published, public content used to build the agent-readiness endpoints
 * (/llms.txt, /feed.xml, /feed.json). Each helper is its own `'use cache'`
 * boundary and tagged for webhook revalidation, mirroring `sitemap.ts`.
 */

export async function getSiteSettings() {
  'use cache';
  return sanityFetch({
    query: settingsQuery,
    schema: settingsSchema,
    tags: ['sanity:type:settings'],
    perspective: 'published',
    stega: false,
  });
}

export async function getLatestArticles() {
  'use cache';
  return sanityFetch({
    query: latestArticlesQuery,
    params: { size: AGENT_FEED_SIZE },
    schema: articleListSchema,
    tags: ['sanity:type:article'],
    perspective: 'published',
    stega: false,
  });
}

export async function getNavPages() {
  'use cache';
  return sanityFetch({
    query: navPagesQuery,
    schema: navPagesSchema,
    tags: ['sanity:type:page'],
    perspective: 'published',
    stega: false,
  });
}

export async function getAllCategories() {
  'use cache';
  return sanityFetch({
    query: allCategoriesQuery,
    schema: allCategoriesSchema,
    tags: ['sanity:type:category'],
    perspective: 'published',
    stega: false,
  });
}
