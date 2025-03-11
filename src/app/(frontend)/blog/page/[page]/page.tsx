import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postsArchiveQuery } from '@/sanity/queries/queries';
import { PaginatedResult, paginatedData } from '@/lib/pagination';
import PostListingRoute from '../../PostListingRoute';
import { PostsArchiveQueryResult } from '@/sanity.types';
import { Metadata } from 'next';

const POSTS_PER_PAGE = 10;

type Props = {
  params: Promise<{ page: string }>;
};

const loadData = async (props: Props): Promise<PaginatedResult<PostsArchiveQueryResult>> => {
  const { page } = await props.params;

  const pageNumber = parseInt(page, 10);

  if (!pageNumber) {
    notFound();
  }

  const from = (pageNumber - 1) * POSTS_PER_PAGE;
  const to = pageNumber * POSTS_PER_PAGE + 1;

  const { data } = await sanityFetch({
    query: postsArchiveQuery,
    params: { from, to, filters: {} },
  });

  return paginatedData(data, pageNumber, POSTS_PER_PAGE);
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const routeData = await loadData(props);

  if (!routeData) {
    return {};
  }

  return {
    title: routeData.currentPage === 1 ? 'Blog' : `Blog - Page ${routeData.currentPage}`,
    alternates: {
      canonical: '/blog',
    },
    description: 'All the latest posts from our blog',
  };
}

export default async function PostPage(props: Props) {
  const routeData = await loadData(props);

  if (!routeData) {
    notFound();
  }

  return (
    <PostListingRoute
      listingData={routeData.data}
      currentPage={routeData.currentPage}
      totalPages={routeData.totalPages}
    />
  );
}

export async function generateStaticParams() {
  return [];
}
