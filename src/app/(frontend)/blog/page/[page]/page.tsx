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

type Props = {
  params: Promise<{ page: string }>;
};

const loadPostsPageData = async (
  props: Props,
): Promise<{
  blogPage: BlogPageQueryResult;
  posts: PaginatedResult<PostsArchiveQueryResult>;
}> => {
  const { page } = await props.params;

  const pageNumber = parseInt(page, 10);

  if (!pageNumber) {
    notFound();
  }

  const [{ data: blogPageData }, { data: posts }] = await Promise.all([
    sanityFetch({
      query: blogPageQuery,
    }),
    sanityFetch({
      query: postsArchiveQuery,
      params: {
        from: (pageNumber - 1) * POSTS_PER_PAGE,
        to: pageNumber * POSTS_PER_PAGE - 1,
        filters: {},
      },
    }),
  ]);

  return {
    blogPage: blogPageData,
    posts: paginatedData(posts, pageNumber, POSTS_PER_PAGE),
  };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const routeData = await loadPostsPageData(props);

  if (!routeData.blogPage || !routeData.posts) {
    return notFound();
  }

  if (!routeData.blogPage.seo) {
    return {};
  }

  const seo = formatMetaData(routeData.blogPage.seo, routeData.blogPage?.name || '');
  seo.title += ` - Page ${routeData.posts.currentPage}`;

  return seo;
}

export async function generateStaticParams() {
  return [];
}

export default async function PostPage(props: Props) {
  const routeData = await loadPostsPageData(props);

  if (!routeData) {
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
