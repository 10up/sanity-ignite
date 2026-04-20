import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import Page from '@/components/templates/Page';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import {
  allCategoriesQuery,
  blogPageQuery,
} from '@/lib/sanity/queries/queries';
import {
  allCategoriesSchema,
  blogPageSchema,
} from '@/lib/sanity/queries/schemas';
import { BlogFilters } from './BlogFilters';
import { BlogResults } from './BlogResults';
import { BlogResultsSkeleton } from './BlogResultsSkeleton';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const blogPage = await sanityFetch({
    query: blogPageQuery,
    schema: blogPageSchema,
    cache: { profile: 'hours', tags: ['sanity:type:blogPage'] },
  });

  if (!blogPage?.seo) {
    return {};
  }

  return formatMetaData(
    blogPage.seo as Parameters<typeof formatMetaData>[0],
    blogPage?.name || ''
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const [blogPage, categories] = await Promise.all([
    sanityFetch({
      query: blogPageQuery,
      schema: blogPageSchema,
      cache: { profile: 'hours', tags: ['sanity:type:blogPage'] },
    }),
    sanityFetch({
      query: allCategoriesQuery,
      schema: allCategoriesSchema,
      cache: { profile: 'hours', tags: ['sanity:type:category'] },
    }),
  ]);

  return (
    <Page title={blogPage?.name ?? 'Blog'}>
      <Suspense>
        <BlogFilters categories={categories ?? []} />
      </Suspense>
      <Suspense fallback={<BlogResultsSkeleton />}>
        <BlogResults searchParams={searchParams} />
      </Suspense>
    </Page>
  );
}
