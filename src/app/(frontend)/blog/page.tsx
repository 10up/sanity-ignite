import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/live';
import { postsArchiveQuery } from '@/sanity/queries/queries';
import { PaginatedResult, paginatedData } from '@/lib/pagination';
import PostListingRoute from './PostListingRoute';
import { PostsArchiveQueryResult } from '@/sanity.types';
import { Metadata } from 'next';
const POSTS_PER_PAGE = 10;

const loadData = async (): Promise<PaginatedResult<PostsArchiveQueryResult>> => {
  const from = 0;
  const to = POSTS_PER_PAGE + 1;

  const { data } = await sanityFetch({
    query: postsArchiveQuery,
    params: { from, to, filters: {} },
  });

  return paginatedData(data, 1, POSTS_PER_PAGE);
};

export async function generateMetadata(): Promise<Metadata> {
  const routeData = await loadData();

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

export default async function PostPage() {
  const routeData = await loadData();

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
