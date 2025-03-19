import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/getBaseUrl';

const baseUrl = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV === 'production') {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
