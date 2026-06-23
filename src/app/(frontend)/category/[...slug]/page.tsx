import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { TwoColumnArticleFeed } from '@/components/sections/TwoColumnArticleFeed';
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

export default async function CategoryPage(props: Props) {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <DynamicCategoryPage params={props.params} />
      </Suspense>
    );
  }

  const { slug } = await props.params;
  return <CachedCategoryPage slug={slug} perspective="published" stega={false} />;
}

async function DynamicCategoryPage({ params }: Pick<Props, 'params'>) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedCategoryPage slug={slug} {...options} />;
}

async function CachedCategoryPage({
  slug,
  perspective,
  stega,
}: { slug: string[] } & DynamicFetchOptions) {
  'use cache';

  const [parentSlug, subcategorySlug, ...rest] = slug ?? [];

  if (!parentSlug || rest.length > 0) {
    notFound();
  }

  // The query climbs to the parent, so we can resolve from whichever slug is
  // the most specific (the subcategory when present, otherwise the parent).
  const requestedSlug = subcategorySlug ?? parentSlug;
  const category = await sanityFetch({
    query: categoryQuery,
    schema: categorySchema,
    params: { slug: requestedSlug },
    tags: [`sanity:category:${requestedSlug}`],
    perspective,
    stega,
  });

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
      <CategoryHero category={category} activeSubcategory={activeSubcategory} />
      <Suspense fallback={null}>
        <TwoColumnArticleFeed
          categorySlug={activeSubcategory ?? category.slug}
          size={20}
        />
      </Suspense>
    </>
  );
}
