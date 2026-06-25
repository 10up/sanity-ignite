/**
 * The Agent Skill this site publishes for discovery via
 * `/.well-known/agent-skills/`. See
 * https://specification.website/spec/agent-readiness/agent-skills-discovery/.
 *
 * `body` is the exact `SKILL.md` served to agents; the discovery index hashes
 * these same bytes, so keep them the single source of truth.
 */

export const SITE_SKILL_NAME = 'ignite-for-sanity';

const SITE_SKILL_DESCRIPTION =
  'Use when reading or summarizing content from this site. Explains the machine-readable endpoints available: /llms.txt for a curated index, /feed.xml and /feed.json for the latest articles, /sitemap.xml for every URL, and the JSON-LD structured data embedded in each page. Prefer these over scraping HTML.';

export const SITE_SKILL_BODY = `---
name: ${SITE_SKILL_NAME}
description: ${SITE_SKILL_DESCRIPTION}
---

# Working with this site

This site is built with Next.js and Sanity. It exposes several machine-readable
surfaces so you can read its content without scraping rendered HTML.

## When to use this skill

Use it whenever you need to read, index, summarize, or cite content from this
site. Start from the endpoints below rather than crawling pages.

## Endpoints

- **\`/llms.txt\`** — a curated Markdown index of the most important content,
  grouped into Articles, Categories, and Pages. Fetch this first.
- **\`/feed.xml\`** — RSS 2.0 feed of the latest articles (titles, links,
  summaries, publish dates, categories).
- **\`/feed.json\`** — the same feed as JSON Feed 1.1, friendlier for tooling.
- **\`/sitemap.xml\`** — every indexable URL with last-modified dates.
- **\`/robots.txt\`** — crawl policy, including per-vendor AI user-agent rules.

## Structured data

Every content page embeds schema.org JSON-LD in a
\`<script type="application/ld+json">\` block that is present in the initial HTML
(server-rendered). Articles use \`BlogPosting\`, categories use
\`CollectionPage\` plus \`BreadcrumbList\`, and the site-wide \`Organization\`
and \`WebSite\` entities are linked by \`@id\`. Read the JSON-LD to extract typed
facts (author, publish date, section) instead of guessing from prose.

## Conventions

- URLs are stable and slug-based: articles live at \`/article/<slug>\`,
  categories at \`/category/<parent>\` or \`/category/<parent>/<child>\`.
- Discovery links are also advertised in the HTTP \`Link\` response header.
`;
