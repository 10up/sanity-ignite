import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PageSections from '@/components/sections/PageSections';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from '@/components/sections/RecommendedArticleList';
import { TwoColumnArticleFeed } from '@/components/sections/TwoColumnArticleFeed';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  type LivePerspective,
} from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { fetchSiteName } from '@/lib/sanity/client/settings';
import { homePageQuery } from '@/lib/sanity/queries/queries';
import { homePageSchema } from '@/lib/sanity/queries/schemas';

const cacheTags = ['sanity:type:homePage'];

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions();
  const [homePage, siteName] = await Promise.all([
    fetchHomePageMeta(perspective),
    fetchSiteName(),
  ]);

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(
    homePage.seo as Parameters<typeof formatMetaData>[0],
    homePage?.name || '',
    { type: 'homePage', slug: 'home', updatedAt: homePage._updatedAt, siteName }
  );
}

// Metadata never wants stega-encoded strings, but it still resolves the
// perspective so Presentation can preview draft metadata.
async function fetchHomePageMeta(perspective: LivePerspective) {
  'use cache';
  return sanityFetch({
    query: homePageQuery,
    schema: homePageSchema,
    tags: cacheTags,
    perspective,
    stega: false,
  });
}

export default async function Page() {
  // Resolve request-time perspective/stega once, outside any cache boundary, and
  // drill it into the cached feed. The personalized recommended list stays a
  // dynamic island, slotted in as `children` inside its own <Suspense>.
  const { perspective, stega } = await getDynamicFetchOptions();

  return (
    <>
      <HomePageSections />
      <TwoColumnArticleFeed perspective={perspective} stega={stega}>
        <Suspense fallback={<RecommendedArticleListSkeleton />}>
          <RecommendedArticleList />
        </Suspense>
      </TwoColumnArticleFeed>
    </>
  );
}

// Three-layer pattern. Orchestrator: branches on draftMode() so the published
// branch can prerender as a static shell, while draft mode streams in a dynamic
// render that resolves the editor's perspective.
async function HomePageSections() {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <DraftHomePageSections />
      </Suspense>
    );
  }

  return <CachedHomePageSections perspective="published" stega={false} />;
}

// Draft layer: resolves request-time perspective/stega outside `'use cache'`.
async function DraftHomePageSections() {
  const options = await getDynamicFetchOptions();
  return <CachedHomePageSections {...options} />;
}

// Cached layer: receives serializable props, fetches, and renders.
async function CachedHomePageSections({
  perspective,
  stega,
}: DynamicFetchOptions) {
  'use cache';

  const homePage = await sanityFetch({
    query: homePageQuery,
    schema: homePageSchema,
    tags: cacheTags,
    perspective,
    stega,
  });

  if (!homePage) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;

  return (
    <PageSections
      documentId={_id}
      documentType={_type}
      sections={pageSections}
    />
  );
}
