import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/templates/Page';
import PostRiver from '@/components/templates/PostRiver';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { type PaginatedResult, paginatedData } from '@/lib/pagination';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { blogPageQuery, postsArchiveQuery } from '@/lib/sanity/queries/queries';
import type { BlogPageQueryResult, PostsArchiveQueryResult } from '@/sanity.types';

const loadPostsPageData = async (): Promise<{
  blogPage: BlogPageQueryResult;
  posts: PaginatedResult<PostsArchiveQueryResult>;
}> => {
  const [{ data: blogPageData }, { data: posts }] = await Promise.all([
    sanityFetch({
      query: blogPageQuery,
    }),
    sanityFetch({
      query: postsArchiveQuery,
      params: { from: 0, to: POSTS_PER_PAGE - 1, filters: {} },
    }),
  ]);

  return {
    blogPage: blogPageData,
    posts: paginatedData(posts, 1, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const routeData = await loadPostsPageData();

  if (!routeData.posts || !routeData.blogPage) {
    return notFound();
  }

  if (!routeData.blogPage.seo) {
    return {};
  }

  return formatMetaData(routeData.blogPage.seo, routeData.blogPage?.name || '');
}

export default async function PostPage() {
  const routeData = await loadPostsPageData();

  if (!routeData.posts || !routeData.blogPage) {
    notFound();
  }

  return (
    <Page title={`${routeData.blogPage?.name} - Page ${routeData.posts.currentPage}`}>
      <PostRiver
        listingData={routeData.posts.data}
        currentPage={routeData.posts.currentPage}
        totalPages={routeData.posts.totalPages}
      />
    </Page>
  );
}
