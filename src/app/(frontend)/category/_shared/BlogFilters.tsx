import { cacheLife, cacheTag } from 'next/cache';
import { CACHE_PROFILES, sanityFetch } from '@/lib/sanity/client/fetch';
import { allCategoriesQuery } from '@/lib/sanity/queries/queries';
import { allCategoriesSchema } from '@/lib/sanity/queries/schemas';
import { BlogFiltersClient } from './BlogFiltersClient';

export async function BlogFilters() {
  'use cache';
  cacheTag('sanity:type:category');
  cacheLife(CACHE_PROFILES.days);
  const categories =
    (await sanityFetch({
      query: allCategoriesQuery,
      schema: allCategoriesSchema,
    })) ?? [];

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <BlogFiltersClient categories={categories} />
    </div>
  );
}
