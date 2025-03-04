import { AllPostsQueryResult } from '@/sanity.types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';

export default function Post({ post }: { post: AllPostsQueryResult[number] }) {
  const { title, excerpt, date, author, image, categories } = post;

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/blog/${post.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-full relative">
            <Image
              src={urlForImage(image)?.width(1000).height(667).url() as string}
              alt={image?.alt || 'Blog Post Image'}
              style={{
                objectFit: 'fill',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              width={1000}
              height={667}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="default">{categories?.[0]?.title}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />5 minutes
              </div>
            </div>
            {date ? (
              <time className="text-sm text-gray-500 mb-2">
                {new Date(date).toLocaleDateString()}
              </time>
            ) : null}
            <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 transition-colors">
              {title}
            </h3>
            {excerpt ? <p className="text-gray-600 mb-4">{excerpt}</p> : null}
            <div className="mb-4">
              {author ? (
                <span className="text-sm font-medium text-gray-700">
                  By {author?.firstName} {author?.lastName}
                </span>
              ) : null}
            </div>
            <div className="flex items-center text-pink-600 font-medium">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
