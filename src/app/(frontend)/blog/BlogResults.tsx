import { Pagination } from '@/app/(frontend)/blog/BlogPagination';
import PostCard from '@/components/modules/PostCard';
import { POSTS_PER_PAGE } from '@/lib/constants';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { postsArchiveQuery } from '@/lib/sanity/queries/queries';
import { postsArchiveSchema } from '@/lib/sanity/queries/schemas';

type BlogResultsProps = {
  category: string | null;
  search: string | null;
  sort: string;
  page: number;
};

export async function BlogResults({
  category,
  search,
  sort,
  page,
}: BlogResultsProps) {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = page * POSTS_PER_PAGE - 1;

  const posts = await sanityFetch({
    query: postsArchiveQuery,
    params: {
      from,
      to,
      filters: {
        ...(category ? { categorySlug: category } : {}),
        ...(search ? { search } : {}),
        ...(sort === 'oldest' ? { sortOrder: 'oldest' } : {}),
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
