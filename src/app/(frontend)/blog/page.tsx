import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postsArchiveQuery, blogPageQuery } from '@/sanity/queries/queries';
import { PaginatedResult, paginatedData } from '@/lib/pagination';
import PostRiver from '@/components/PostRiver';
import { PostsArchiveQueryResult, BlogPageQueryResult } from '@/sanity.types';
import { Metadata } from 'next';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import Page from '@/components/templates/Page';

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

  return formatMetaData(
    routeData.blogPage.seo as unknown as SeoType,
    routeData.blogPage?.name || '',
  );
}

export default async function PostPage() {
  const routeData = await loadPostsPageData();

  if (!routeData.posts || !routeData.blogPage) {
    notFound();
  }

  return (
    <>
      <Page title={routeData.blogPage?.name + ' '}>
        <PostRiver
          listingData={routeData.posts.data}
          currentPage={routeData.posts.currentPage}
          totalPages={routeData.posts.totalPages}
        />
      </Page>
    </>
  );
}
