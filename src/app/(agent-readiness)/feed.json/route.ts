import {
  getLatestArticles,
  getSiteSettings,
} from '@/lib/agent-readiness/content';
import { renderJsonFeed } from '@/lib/agent-readiness/feeds';
import { getBaseUrl } from '@/utils/getBaseUrl';

// /feed.json — JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/)
export async function GET() {
  const [settings, articles] = await Promise.all([
    getSiteSettings(),
    getLatestArticles(),
  ]);

  const body = renderJsonFeed({ settings, articles, baseUrl: getBaseUrl() });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
