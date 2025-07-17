import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { ReadTime } from '@/components/ui/ReadTime';
import { getDocumentLink } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { PostCardFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function PostCard({ post }: { post: PostCardFragmentType }) {
  const { title, excerpt, date, author, image, categories } = post;

  const featuredCategory = categories?.[0];

  return (
    <article className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative h-64 md:h-full">
          {image ? (
            <Image
              src={urlForImage(image)?.width(1000).height(667).url() as string}
              alt={image?.alt || 'Blog Post Image'}
              style={{
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              width={1000}
              height={667}
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-2">
            {featuredCategory && (
              <Badge variant="default" asChild>
                <Link href={getDocumentLink(featuredCategory)}>{featuredCategory.title}</Link>
              </Badge>
            )}
            <ReadTime wordCount={post.wordCount} />
          </div>
          {date ? (
            <time className="text-sm text-gray-500 mb-4">
              {new Date(date).toLocaleDateString()}
            </time>
          ) : null}
          <h3 className="text-2xl font-bold mb-">
            <Link href={`/blog/${post.slug}`} className="hover:text-pink-600 transition-colors">
              {title}
            </Link>
          </h3>
          {excerpt ? <p className="text-gray-600 mb-4">{excerpt}</p> : null}
          <div className="mb-4">
            {author ? (
              <span className="text-sm font-medium text-gray-700">
                By {author?.firstName} {author?.lastName}
              </span>
            ) : null}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </article>
  );
}
