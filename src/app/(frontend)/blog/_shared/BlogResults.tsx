import { cacheLife, cacheTag } from 'next/cache';
import type { SearchParams } from 'nuqs/server';
import { Pagination } from '@/app/(frontend)/blog/_shared/BlogPagination';
import PostCard from '@/components/modules/PostCard';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { CACHE_PROFILES, sanityFetch } from '@/lib/sanity/client/fetch';
import {
  postsArchiveOldestQuery,
  postsArchiveQuery,
} from '@/lib/sanity/queries/queries';
import { postsArchiveSchema } from '@/lib/sanity/queries/schemas';
import { loadBlogSearchParams } from './searchParams';

type BlogSearchParamsPromise = Promise<SearchParams>;

export async function BlogResults({
  searchParams,
}: {
  searchParams: BlogSearchParamsPromise;
}) {
  const { category, search, sort, page } =
    await loadBlogSearchParams(searchParams);

  return (
    <BlogResultsCached
      category={category}
      search={search}
      sort={sort}
      page={page}
    />
  );
}

export async function BlogResultsCached({
  category,
  search,
  sort,
  page,
}: {
  category: string | null;
  search: string | null;
  sort: 'recent' | 'oldest';
  page: number;
}) {
  'use cache';
  cacheTag('sanity:type:post');
  cacheLife(CACHE_PROFILES.days);

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
  });
  const totalPages = posts ? Math.ceil(posts.total / POSTS_PER_PAGE) : 0;

  if (!posts || posts.results.length === 0) {
    return <p className="text-center text-gray-500 py-12">No posts found.</p>;
  }

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
