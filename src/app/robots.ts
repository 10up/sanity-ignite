import type { MetadataRoute } from 'next';
import { serverEnv } from '@/env/serverEnv';
import { getBaseUrl } from '@/utils/getBaseUrl';

const baseUrl = getBaseUrl();

// Named AI user-agents, per https://specification.website/spec/agent-readiness/robots-for-ai-crawlers/.
// Default policy: opt OUT of training crawlers, opt IN to retrieval crawlers so
// the site can still be cited live in assistant answers. Flip these as needed —
// cross-reference each vendor's docs, since user-agent names change.
const TRAINING_CRAWLERS = [
  'GPTBot', // OpenAI training
  'Google-Extended', // Gemini / Vertex training (does not affect Search)
  'Applebot-Extended', // Apple Intelligence training (does not affect Siri/Spotlight)
  'ClaudeBot', // Anthropic training & retrieval
  'CCBot', // Common Crawl (dataset behind many open models)
];

const RETRIEVAL_CRAWLERS = [
  'OAI-SearchBot', // OpenAI retrieval (ChatGPT browsing)
  'ChatGPT-User', // On-demand fetches when a ChatGPT user asks for a URL
  'PerplexityBot', // Perplexity retrieval
];

export default function robots(): MetadataRoute.Robots {
  if (serverEnv.NODE_ENV !== 'production') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: [
      ...TRAINING_CRAWLERS.map((userAgent) => ({ userAgent, disallow: '/' })),
      ...RETRIEVAL_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
