import { Person, Post as PostType } from '@/sanity.types';
import Link from 'next/link';
import Date from './Date';
import Author from './Author';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/sanity/lib/utils';
import { Clock, ArrowRight } from 'lucide-react';

export default function Post({ post }: { post: PostType }) {
  const { _id, title, slug, excerpt, date, author, image, categories } = post;

  /*
  <article
      key={_id}
      className="flex max-w-xl flex-col items-start justify-between border-b-2 mb-8"
    >
      <div className="text-gray-500 text-sm">
        <Date dateString={date} /> &bull;{' '}
        {author !== null && <Author author={author as unknown as Person} />}
      </div>

      <h3 className="mt-5 text-2xl font-semibold">
        <Link className="hover:text-red-500 underline transition-colors" href={`/posts/${slug}`}>
          {title}
        </Link>
      </h3>
      <p className="mt-7 line-clamp-3 text-sm leading-6 text-gray-600">{excerpt}</p>
    </article>*/

  return (
    <article className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/posts/${post.slug}`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-full">
            <Image
              src={urlForImage(image)?.width(1000).height(667).url() as string}
              alt={image?.alt || 'Blog Post Image'}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                {categories?.[0]?.title}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />5 minutes
              </div>
            </div>
            <time className="text-sm text-gray-500 mb-2">{date}</time>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
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
