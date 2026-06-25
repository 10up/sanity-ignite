import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryHero } from '@/components/sections/CategoryHero';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from '@/components/sections/RecommendedArticleList';
import { TwoColumnArticleFeed } from '@/components/sections/TwoColumnArticleFeed';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCategorySchema } from '@/lib/agent-readiness/structured-data';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from '@/lib/sanity/client/live';
import { categoryQuery } from '@/lib/sanity/queries/queries';
import { categorySchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Category(props: Props) {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <DraftCategoryPage params={props.params} />
      </Suspense>
    );
  }

  const { slug } = await props.params;
  return <CategoryPage slug={slug} perspective="published" stega={false} />;
}

async function DraftCategoryPage({ params }: Pick<Props, 'params'>) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CategoryPage slug={slug} {...options} />;
}

// Uncached orchestrator: resolves the category (via a cached fetch), runs the
// 404 logic, then renders the hero alongside the feed. It already holds the
// request-time `perspective`/`stega` (resolved by `Category`), so it drills them
// straight into the cached feed. Only the personalized recommended list stays a
// dynamic island, slotted in as `children` inside its own <Suspense>.
async function CategoryPage({
  slug,
  perspective,
  stega,
}: { slug: string[] } & DynamicFetchOptions) {
  const [parentSlug, subcategorySlug, ...rest] = slug ?? [];

  if (!parentSlug || rest.length > 0) {
    notFound();
  }

  // The query climbs to the parent, so we can resolve from whichever slug is
  // the most specific (the subcategory when present, otherwise the parent).
  const requestedSlug = subcategorySlug ?? parentSlug;
  const category = await fetchCategory({ requestedSlug, perspective, stega });

  // The first segment must be the top-level (parent) category. A bare
  // subcategory slug (e.g. `/category/politics`) resolves to its parent, so the
  // slugs won't match and we 404.
  if (!category?.slug || category.slug !== parentSlug) {
    notFound();
  }

  // Figure out which subcategory (if any) the requested slug points at.
  const isParent = requestedSlug === category.slug;
  const activeChild = isParent
    ? null
    : (category.children ?? []).find((child) => child.slug === requestedSlug);

  if (!isParent && !activeChild) {
    notFound();
  }

  const activeSubcategory = activeChild?.slug ?? null;

  return (
    <>
      <JsonLd data={buildCategorySchema(category, activeSubcategory)} />
      <CategoryHero category={category} activeSubcategory={activeSubcategory} />
      <TwoColumnArticleFeed
        categorySlug={activeSubcategory ?? category.slug}
        size={20}
        perspective={perspective}
        stega={stega}
      >
        <Suspense fallback={<RecommendedArticleListSkeleton />}>
          <RecommendedArticleList />
        </Suspense>
      </TwoColumnArticleFeed>
    </>
  );
}

// Cached layer: only the category fetch lives inside `'use cache'`. It returns
// serializable data the uncached orchestrator renders from.
async function fetchCategory({
  requestedSlug,
  perspective,
  stega,
}: { requestedSlug: string } & DynamicFetchOptions) {
  'use cache';

  return sanityFetch({
    query: categoryQuery,
    schema: categorySchema,
    params: { slug: requestedSlug },
    tags: [`sanity:category:${requestedSlug}`],
    perspective,
    stega,
  });
}
