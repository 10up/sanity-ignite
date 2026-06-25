import {
  getAllCategories,
  getLatestArticles,
  getNavPages,
  getSiteSettings,
} from '@/lib/agent-readiness/content';
import { renderLlmsTxt } from '@/lib/agent-readiness/feeds';
import { getBaseUrl } from '@/utils/getBaseUrl';

// /llms.txt — https://specification.website/spec/agent-readiness/llms-txt/
export async function GET() {
  const [settings, articles, categories, pages] = await Promise.all([
    getSiteSettings(),
    getLatestArticles(),
    getAllCategories(),
    getNavPages(),
  ]);

  const body = renderLlmsTxt({
    settings,
    articles,
    categories,
    pages,
    baseUrl: getBaseUrl(),
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}
