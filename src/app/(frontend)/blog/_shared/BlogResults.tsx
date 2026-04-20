import type { z } from 'zod';
import { Pagination } from '@/app/(frontend)/blog/_shared/BlogPagination';
import PostCard from '@/components/modules/PostCard';
import type { postsArchiveSchema } from '@/lib/sanity/queries/schemas';

type Posts = z.infer<typeof postsArchiveSchema>;

type BlogResultsProps = {
  postsPromise: Promise<{
    posts: Posts | null;
    page: number;
    totalPages: number;
  }>;
};

export async function BlogResults({ postsPromise }: BlogResultsProps) {
  const { posts, page, totalPages } = await postsPromise;

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
