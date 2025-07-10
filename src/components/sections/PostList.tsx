import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { PostListSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import PostCard from '../modules/PostCard';
import { Button } from '../ui/Button';

export default function PostListSection({ section }: { section: PostListSectionFragmentType }) {
  const { posts } = section;
  if (!posts.length) {
    return null;
  }

  const numberOfPosts = section.numberOfPosts ?? 3;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{section?.heading}</h2>
          <p className="text-gray-600">Latest updates and insights from our team</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          {posts.slice(0, numberOfPosts).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
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
