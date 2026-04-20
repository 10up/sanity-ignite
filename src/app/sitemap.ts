import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { getSitemapQuery } from '@/lib/sanity/queries/queries';
import { sitemapSchema } from '@/lib/sanity/queries/schemas';
import { getBaseUrl } from '@/utils/getBaseUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await sanityFetch({
    query: getSitemapQuery,
    schema: sitemapSchema,
    cache: {
      profile: 'hours',
      tags: ['sanity:type:page', 'sanity:type:post', 'sanity:type:homePage'],
    },
  });

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
