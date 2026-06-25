import {
  getLatestArticles,
  getSiteSettings,
} from '@/lib/agent-readiness/content';
import { renderRssFeed } from '@/lib/agent-readiness/feeds';
import { getBaseUrl } from '@/utils/getBaseUrl';

// /feed.xml — https://specification.website/spec/agent-readiness/machine-readable-formats/
export async function GET() {
  const [settings, articles] = await Promise.all([
    getSiteSettings(),
    getLatestArticles(),
  ]);

  const body = renderRssFeed({ settings, articles, baseUrl: getBaseUrl() });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
