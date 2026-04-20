import type { SearchParams } from 'nuqs/server';
import { Pagination } from '@/app/(frontend)/blog/BlogPagination';
import PostCard from '@/components/modules/PostCard';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  postsArchiveOldestQuery,
  postsArchiveQuery,
} from '@/lib/sanity/queries/queries';
import { postsArchiveSchema } from '@/lib/sanity/queries/schemas';
import { loadBlogSearchParams } from './searchParams';

type BlogResultsProps = {
  searchParams: Promise<SearchParams>;
};

export async function BlogResults({ searchParams }: BlogResultsProps) {
  const { category, search, sort, page } =
    await loadBlogSearchParams(searchParams);

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = page * POSTS_PER_PAGE - 1;

  const query = sort === 'oldest' ? postsArchiveOldestQuery : postsArchiveQuery;

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

  if (!posts || posts.results.length === 0) {
    return <p className="text-center text-gray-500 py-12">No posts found.</p>;
  }

  const totalPages = Math.ceil(posts.total / POSTS_PER_PAGE);

  return (
    <>
      <div className="grid grid-cols-1 gap-10">
        {posts.results.map((post: (typeof posts.results)[number]) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </>
  );
}
