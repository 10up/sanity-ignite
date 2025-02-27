import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { getSitemapQuery } from '@/sanity/queries/queries';
import { getBaseUrl } from '@/utils/getBaseUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await client.fetch(getSitemapQuery);

    if (!paths) return [];

    const baseUrl = getBaseUrl();

    return paths.map((path) => ({
      url: new URL(path.href!, baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      changeFrequency: 'weekly',
      priority: 1,
    }));
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return [];
  }
}
