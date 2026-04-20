import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import Page from '@/components/templates/Page';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import {
  allCategoriesQuery,
  blogPageQuery,
  postsArchiveOldestQuery,
  postsArchiveQuery,
} from '@/lib/sanity/queries/queries';
import {
  allCategoriesSchema,
  blogPageSchema,
  postsArchiveSchema,
} from '@/lib/sanity/queries/schemas';
import { BlogFilters } from './_shared/BlogFilters';
import { BlogResults } from './_shared/BlogResults';
import { BlogResultsSkeleton } from './_shared/BlogResultsSkeleton';
import { loadBlogSearchParams } from './_shared/searchParams';

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

export default function BlogPage({ searchParams }: Props) {
  const categoriesPromise = sanityFetch({
    query: allCategoriesQuery,
    schema: allCategoriesSchema,
    cache: { profile: 'hours', tags: ['sanity:type:category'] },
  });

  const postsPromise = loadBlogSearchParams(searchParams).then(
    async ({ category, search, sort, page }) => {
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = page * POSTS_PER_PAGE - 1;
      const query =
        sort === 'oldest' ? postsArchiveOldestQuery : postsArchiveQuery;
      const posts = await sanityFetch({
        query,
        params: {
          from,
          to,
          filters: {
            ...(category ? { categorySlug: category } : {}),
            ...(search ? { search } : {}),
          },
        },
        schema: postsArchiveSchema,
        cache: {
          profile: 'hours',
          tags: [
            'sanity:type:post',
            ...(category ? [`sanity:slug:${category}`] : []),
          ],
        },
      });
      const totalPages = posts ? Math.ceil(posts.total / POSTS_PER_PAGE) : 0;
      return { posts, page, totalPages };
    }
  );

  return (
    <Page title="Blog">
      <Suspense>
        <BlogFilters categoriesPromise={categoriesPromise} />
      </Suspense>
      <Suspense fallback={<BlogResultsSkeleton />}>
        <BlogResults postsPromise={postsPromise} />
      </Suspense>
    </Page>
  );
}
