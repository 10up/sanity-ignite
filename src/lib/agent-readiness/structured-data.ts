/**
 * schema.org JSON-LD builders. Each returns a plain object ready to hand to the
 * `<JsonLd>` component. Keep the markup honest: only describe what is actually
 * visible on the page (https://specification.website/spec/agent-readiness/structured-data-for-agents/).
 *
 * Entities are linked by `@id` so agents can merge them across pages. The site
 * graph (Organization + WebSite) is emitted once in the frontend layout, so
 * per-page builders can reference `#organization` without repeating it.
 */

import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ArticleFragmentType,
  CategoryFragmentType,
  ImageFragmentType,
  SettingsType,
} from '@/lib/sanity/queries/schemas';
import { getBaseUrl } from '@/utils/getBaseUrl';

const SCHEMA_CONTEXT = 'https://schema.org';

const organizationId = (baseUrl: string) => `${baseUrl}/#organization`;
const websiteId = (baseUrl: string) => `${baseUrl}/#website`;

function absoluteImageUrl(
  image: ImageFragmentType | null | undefined,
  width = 1200,
  height = 630
) {
  return urlForImage(image)?.width(width).height(height).url();
}

/**
 * Organization + WebSite, linked by `@id`. Rendered once, site-wide, so other
 * builders can reference the organization as the publisher.
 */
export function buildSiteGraph(settings: SettingsType) {
  const baseUrl = getBaseUrl();
  const name = settings?.title ?? 'Ignite for Sanity';

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId(baseUrl),
        name,
        url: baseUrl,
        logo: `${baseUrl}/fueled_planet@2x.png`,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(baseUrl),
        name,
        description: settings?.description ?? undefined,
        url: baseUrl,
        publisher: { '@id': organizationId(baseUrl) },
      },
    ],
  };
}

export function buildArticleSchema(article: ArticleFragmentType) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/article/${article.slug}`;
  const authorName = [article.author?.firstName, article.author?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.date ?? undefined,
    url,
    mainEntityOfPage: url,
    image: absoluteImageUrl(article.image) ?? undefined,
    articleSection: article.categories?.[0]?.title ?? undefined,
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
          jobTitle: article.author?.role ?? undefined,
        }
      : undefined,
    publisher: { '@id': organizationId(baseUrl) },
  };
}

export function buildPageSchema(page: {
  name?: string | null;
  excerpt?: string | null;
  slug?: { current: string } | null;
}) {
  const baseUrl = getBaseUrl();

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebPage',
    name: page.name ?? undefined,
    description: page.excerpt ?? undefined,
    url: page.slug?.current ? `${baseUrl}/${page.slug.current}` : baseUrl,
    isPartOf: { '@id': websiteId(baseUrl) },
  };
}

/**
 * Category landing page: a CollectionPage plus a BreadcrumbList trail. The trail
 * mirrors the visible hierarchy (Home → parent → subcategory).
 */
export function buildCategorySchema(
  category: CategoryFragmentType,
  activeSubcategory?: string | null
) {
  const baseUrl = getBaseUrl();
  const parentSlug = category.slug ?? '';
  const activeChild = activeSubcategory
    ? category.children?.find((child) => child.slug === activeSubcategory)
    : null;

  const url = activeChild
    ? `${baseUrl}/category/${parentSlug}/${activeChild.slug}`
    : `${baseUrl}/category/${parentSlug}`;

  const crumbs = [
    { name: 'Home', item: baseUrl },
    {
      name: category.title ?? parentSlug,
      item: `${baseUrl}/category/${parentSlug}`,
    },
  ];
  if (activeChild) {
    crumbs.push({
      name: activeChild.title ?? activeChild.slug ?? '',
      item: url,
    });
  }

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: activeChild?.title ?? category.title ?? undefined,
        description: category.description ?? undefined,
        url,
        isPartOf: { '@id': websiteId(baseUrl) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ],
  };
}
