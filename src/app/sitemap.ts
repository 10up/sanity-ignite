import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { getSitemapQuery } from '@/lib/sanity/queries/queries';
import { sitemapSchema } from '@/lib/sanity/queries/schemas';
import { getBaseUrl } from '@/utils/getBaseUrl';

const TAGS = [
  'sanity:type:page',
  'sanity:type:article',
  'sanity:type:category',
  'sanity:type:homePage',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await fetchSitemap();

  if (!paths) return [];

  const baseUrl = getBaseUrl();

  return paths
    .filter((path) => path.href)
    .map((path) => ({
      url: new URL(path.href ?? '', baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 1,
    }));
}

async function fetchSitemap() {
  'use cache';
  return sanityFetch({
    query: getSitemapQuery,
    schema: sitemapSchema,
    tags: TAGS,
    perspective: 'published',
    stega: false,
  });
}
