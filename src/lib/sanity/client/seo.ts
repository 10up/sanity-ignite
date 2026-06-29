import type { Metadata } from 'next';
import type { SeoFragmentType } from '../queries/schemas';
import { resolveOpenGraphImage } from './utils';

/**
 * Identifies the document the metadata is for. Drives three derived values that
 * shouldn't be hand-entered per document:
 *  - the canonical `og:url` (from the route),
 *  - the dynamic OG card image URL (when enabled), and
 *  - `updatedAt` as a cache-busting token for that card URL.
 * `siteName` is the global brand name (from Settings), applied as `og:site_name`.
 */
type MetaTarget = {
  type: string;
  slug: string;
  updatedAt?: string | null;
  siteName?: string | null;
};

// Canonical path for a document, derived from its route — never typed by hand.
// Relative; Next resolves it against `metadataBase` (set in the root layout).
function canonicalPath({ type, slug }: MetaTarget): string {
  switch (type) {
    case 'homePage':
      return '/';
    case 'article':
      return `/article/${slug}`;
    default:
      return `/${slug}`;
  }
}

function ogCardImageUrl({ type, slug, updatedAt }: MetaTarget) {
  const segment = slug || 'home';
  const url = `/api/og/${encodeURIComponent(type)}/${encodeURIComponent(segment)}`;
  const version = updatedAt ? new Date(updatedAt).getTime() : null;
  return version ? `${url}?v=${version}` : url;
}

export const formatMetaData = (
  seo: SeoFragmentType,
  defaultTitle: string,
  target?: MetaTarget
): Metadata => {
  const staticImage = resolveOpenGraphImage(seo?.metaImage);

  // When the editor has toggled on the dynamic card, point og:image at the
  // generator route; otherwise share the chosen image as-is.
  const dynamicOgImage =
    seo?.generateCard && target
      ? [
          {
            url: ogCardImageUrl(target),
            width: 1200,
            height: 630,
          },
        ]
      : undefined;

  const openGraphImages = dynamicOgImage ?? staticImage;
  const canonicalUrl = target ? canonicalPath(target) : undefined;
  const siteName = target?.siteName ?? undefined;

  return {
    title: seo?.metaTitle ?? defaultTitle,
    description: seo?.metaDescription,
    robots: seo?.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph:
      seo?.openGraph || openGraphImages || canonicalUrl || siteName
        ? {
            title: seo?.openGraph?.title ?? undefined,
            description: seo?.openGraph?.description ?? undefined,
            siteName,
            url: canonicalUrl,
            images: openGraphImages,
          }
        : undefined,
    // No `twitter` field on purpose. Next.js automatically mirrors Open Graph
    // into the `twitter:*` tags (using `summary_large_image` when an image is
    // present, `summary` otherwise), so X/Slack/etc. get a correct card with no
    // platform-specific fields to maintain.
  };
};
