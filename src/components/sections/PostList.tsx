import { PostList } from '@/sanity.types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { sanityFetch } from '@/sanity/lib/live';
import { postsArchiveQuery } from '@/sanity/queries/queries';
import PostCard from '../PostCard';
import { Button } from '../ui/button';

export default async function PostListSection({ section }: { section: PostList }) {
  const { data: posts } = await sanityFetch({
    query: postsArchiveQuery,
    params: { from: 0, to: (section.numberOfPosts || 3) - 1 },
  });

  if (!posts) {
    return null;
  }

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{section?.heading}</h2>
          <p className="text-gray-600">Latest updates and insights from our team</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          {posts.results.map((post) => {
            if (post) {
              return <PostCard key={post._id} post={post} />;
            }
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="gradient" size={'xl'}>
            <Link href={'/blog'}>
              View All Posts <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
