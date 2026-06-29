import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ArticleCardFragmentType,
  CategoryFragmentType,
  SettingsType,
} from '@/lib/sanity/queries/schemas';

/**
 * Pure serializers for the agent-readiness feed family. Each takes already
 * fetched, validated data plus the absolute base URL and returns a string body.
 * Keeping them side-effect-free makes the route handlers thin adapters and lets
 * these be unit-tested without a network or cache.
 *
 * See https://specification.website/spec/agent-readiness/machine-readable-formats/
 * and https://specification.website/spec/agent-readiness/llms-txt/.
 */

const FALLBACK_TITLE = 'Ignite for Sanity';

type NavPage = { title?: string | null; slug?: string | null };

type FeedInput = {
  settings: SettingsType | null;
  articles: ArticleCardFragmentType[] | null;
  baseUrl: string;
};

type LlmsInput = FeedInput & {
  categories: CategoryFragmentType[] | null;
  pages: NavPage[] | null;
};

function articleUrl(baseUrl: string, slug?: string | null) {
  return `${baseUrl}/article/${slug}`;
}

function authorName(article: ArticleCardFragmentType) {
  return [article.author?.firstName, article.author?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * `/llms.txt` — a curated, human-readable Markdown index. This is a curation,
 * not a sitemap: it lists the content we most want agents to read.
 */
export function renderLlmsTxt({
  settings,
  articles,
  categories,
  pages,
  baseUrl,
}: LlmsInput): string {
  const lines: string[] = [];

  lines.push(`# ${settings?.title ?? FALLBACK_TITLE}`);
  if (settings?.description) {
    lines.push('', `> ${settings.description}`);
  }

  const articleLinks = (articles ?? [])
    .filter((article) => article.slug)
    .map((article) => {
      const url = articleUrl(baseUrl, article.slug);
      const suffix = article.excerpt ? `: ${article.excerpt}` : '';
      return `- [${article.title}](${url})${suffix}`;
    });
  if (articleLinks.length) {
    lines.push('', '## Articles', ...articleLinks);
  }

  const categoryLinks = (categories ?? [])
    .filter((category) => category.slug)
    .map((category) => {
      const url = `${baseUrl}/category/${category.slug}`;
      const suffix = category.description ? `: ${category.description}` : '';
      return `- [${category.title ?? category.slug}](${url})${suffix}`;
    });
  if (categoryLinks.length) {
    lines.push('', '## Categories', ...categoryLinks);
  }

  const pageLinks = (pages ?? [])
    .filter((page) => page.slug)
    .map((page) => `- [${page.title ?? page.slug}](${baseUrl}/${page.slug})`);
  if (pageLinks.length) {
    lines.push('', '## Pages', ...pageLinks);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * `/feed.xml` — RSS 2.0. Item bodies use the excerpt; full bodies belong to the
 * per-page Markdown source endpoints (a separate spec item).
 */
export function renderRssFeed({
  settings,
  articles,
  baseUrl,
}: FeedInput): string {
  const title = settings?.title ?? FALLBACK_TITLE;
  const description = settings?.description ?? '';
  const feedUrl = `${baseUrl}/feed.xml`;

  const items = (articles ?? [])
    .filter((article) => article.slug)
    .map((article) => {
      const url = articleUrl(baseUrl, article.slug);
      const pubDate = article.date
        ? new Date(article.date).toUTCString()
        : undefined;
      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
        article.excerpt
          ? `      <description>${escapeXml(article.excerpt)}</description>`
          : '',
        ...(article.categories ?? [])
          .filter((category) => category.title)
          .map(
            (category) =>
              `      <category>${escapeXml(category.title as string)}</category>`
          ),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(description)}</description>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

/** `/feed.json` — JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/). */
export function renderJsonFeed({
  settings,
  articles,
  baseUrl,
}: FeedInput): string {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: settings?.title ?? FALLBACK_TITLE,
    description: settings?.description ?? undefined,
    home_page_url: baseUrl,
    feed_url: `${baseUrl}/feed.json`,
    items: (articles ?? [])
      .filter((article) => article.slug)
      .map((article) => {
        const url = articleUrl(baseUrl, article.slug);
        const name = authorName(article);
        return {
          id: url,
          url,
          title: article.title,
          summary: article.excerpt ?? undefined,
          date_published: article.date ?? undefined,
          image:
            urlForImage(article.image)?.width(1200).height(630).url() ??
            undefined,
          authors: name ? [{ name }] : undefined,
          tags: (article.categories ?? [])
            .map((category) => category.title)
            .filter((tag): tag is string => Boolean(tag)),
        };
      }),
  };

  return JSON.stringify(feed, null, 2);
}
