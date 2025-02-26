import { PostList } from '@/sanity.types';
import Posts from '../Posts';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function PostListSection({ section }: { section: PostList }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{section?.heading}</h2>
          <p className="text-gray-600">Latest updates and insights from our team</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          <Posts />
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-medium hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
