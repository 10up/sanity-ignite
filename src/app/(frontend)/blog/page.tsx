import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import Page from '@/components/templates/Page';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { blogPageQuery } from '@/lib/sanity/queries/queries';
import { blogPageSchema } from '@/lib/sanity/queries/schemas';
import { BlogFilters } from './_shared/BlogFilters';
import { BlogResults } from './_shared/BlogResults';
import { BlogResultsSkeleton } from './_shared/BlogResultsSkeleton';

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata(): Promise<Metadata> {
  const blogPage = await sanityFetch({
    query: blogPageQuery,
    schema: blogPageSchema,
    cache: { profile: 'days', tags: ['sanity:type:blogPage'] },
  });

  if (!blogPage?.seo) {
    return {};
  }

  return formatMetaData(
    blogPage.seo as Parameters<typeof formatMetaData>[0],
    blogPage?.name || ''
  );
}

export default function BlogPage({ searchParams }: Props) {
  return (
    <Page title="Blog">
      <Suspense>
        <BlogFilters />
      </Suspense>
      <Suspense fallback={<BlogResultsSkeleton />}>
        <BlogResults searchParams={searchParams} />
      </Suspense>
    </Page>
  );
}
