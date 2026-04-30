// import type { Metadata } from 'next';

// import { Suspense } from 'react';
// import Page from '@/components/templates/Page';
// import type { CacheProfile } from '@/lib/sanity/client/fetch';
// import { sanityFetch } from '@/lib/sanity/client/fetch';
// import { formatMetaData } from '@/lib/sanity/client/seo';
// import { blogPageQuery } from '@/lib/sanity/queries/queries';
// import { blogPageSchema } from '@/lib/sanity/queries/schemas';
// import { BlogFilters } from './_shared/BlogFilters';
// import { BlogResults } from './_shared/BlogResults';
// import { BlogResultsSkeleton } from './_shared/BlogResultsSkeleton';

import { notFound } from 'next/navigation';
import type { SearchParams } from 'nuqs/server';
import { CategoryHero } from '@/components/sections/CategoryHero';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { categoryQuery } from '@/lib/sanity/queries/queries';
import { categorySchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

const fetchOptions = (slug: string) => ({
  query: categoryQuery,
  schema: categorySchema,
  cache: {
    profile: 'days' as CacheProfile,
    tags: [`sanity:slug:${slug}`],
  },
  params: { slug },
});

// export async function generateMetadata(): Promise<Metadata> {
//   const blogPage = await sanityFetch({
//     query: blogPageQuery,
//     schema: blogPageSchema,
//     cache: { profile: 'days' as CacheProfile, tags: ['sanity:type:blogPage'] },
//   });

//   if (!blogPage?.seo) {
//     return {};
//   }

//   return formatMetaData(
//     blogPage.seo as Parameters<typeof formatMetaData>[0],
//     blogPage?.name || ''
//   );
// }

export default async function BlogPage({ params, searchParams }: Props) {
  const { slug } = await params;

  if (!slug || Array.isArray(slug)) {
    notFound();
  }

  const category = await sanityFetch(fetchOptions(slug));

  if (!category) {
    notFound();
  }

  return <CategoryHero category={category} />;
  // return (
  // <Page title="Blog">
  //   <Suspense>
  //     <BlogFilters />
  //   </Suspense>
  //   <Suspense fallback={<BlogResultsSkeleton />}>
  //     <BlogResults searchParams={searchParams} />
  //   </Suspense>
  // </Page>
  // );
}
