import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/getBaseUrl';

const baseUrl = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
