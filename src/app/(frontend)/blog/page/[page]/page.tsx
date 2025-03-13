import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postsArchiveQuery, blogPageQuery } from '@/sanity/queries/queries';
import { PaginatedResult, paginatedData } from '@/lib/pagination';
import PostRiver from '@/components/PostRiver';
import { PostsArchiveQueryResult, BlogPageQueryResult } from '@/sanity.types';
import { Metadata } from 'next';
import { POSTS_PER_PAGE } from '@/lib/constants';
import ContainedWithTitle from '@/components/templates/ContainedWithTitle';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';

type Props = {
  params: Promise<{ page: string }>;
};

export const loadPostsPageData = async (
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

  const seo = formatMetaData(
    routeData.blogPage.seo as unknown as SeoType,
    routeData.blogPage?.name || '',
  );
  seo.title += ' - Page ' + routeData.posts.currentPage;

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
    <>
      <ContainedWithTitle
        title={routeData.blogPage?.name + ' - Page ' + routeData.posts.currentPage}
      >
        <PostRiver
          listingData={routeData.posts.data}
          currentPage={routeData.posts.currentPage}
          totalPages={routeData.posts.totalPages}
        />
      </ContainedWithTitle>
    </>
  );
}
