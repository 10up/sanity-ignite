import { notFound } from 'next/navigation';
import { CategoryHero } from '@/components/sections/CategoryHero';
import { TwoColumnArticleFeed } from '@/components/sections/TwoColumnArticleFeed';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { categoryQuery } from '@/lib/sanity/queries/queries';
import { categorySchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const fetchOptions = (slug: string) => ({
  query: categoryQuery,
  schema: categorySchema,
  cache: {
    profile: 'days' as CacheProfile,
    tags: [`sanity:category:${slug}`],
  },
  params: { slug },
});

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [parentSlug, subcategorySlug, ...rest] = slug ?? [];

  if (!parentSlug || rest.length > 0) {
    notFound();
  }

  // The query climbs to the parent, so we can resolve from whichever slug is
  // the most specific (the subcategory when present, otherwise the parent).
  const requestedSlug = subcategorySlug ?? parentSlug;
  const category = await sanityFetch(fetchOptions(requestedSlug));

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
      <TwoColumnArticleFeed
        categorySlug={activeSubcategory ?? category.slug}
        size={20}
      />
    </>
  );
}
