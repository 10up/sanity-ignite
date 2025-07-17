import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { Badge } from '@/components/ui/Badge';
import { DateComponent } from '@/components/ui/Date';
import { ReadTime } from '@/components/ui/ReadTime';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { PostCardFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function Byline({ post }: { post: PostCardFragmentType }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {post.author?.image?.asset?._ref ? (
          <div className="mr-4 h-9 w-9">
            <Image
              alt={post.author?.image?.alt || ''}
              className="h-full rounded-full object-cover"
              height={48}
              width={48}
              src={
                urlForImage(post.author?.image)?.height(96).width(96).fit('crop').url() as string
              }
            />
          </div>
        ) : (
          <div className="mr-1">By </div>
        )}
        <div className="flex flex-col">
          {post.author?.firstName && post.author?.lastName && post.author?.slug ? (
            <Link
              className="font-bold underline hover:text-gray-700 transition-colors"
              href={`/author/${post.author.slug}`}
            >
              {post.author.firstName} {post.author.lastName}
            </Link>
          ) : null}
          <div className="text-gray-500 text-sm">
            <DateComponent dateString={post.date} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {post.categories && post.categories?.length > 0 && (
          <div className="flex items-center gap-2">
            {post.categories.filter(Boolean).map((category) => (
              <Badge variant="default" asChild key={category._id}>
                <Link href={`/category/${category.slug}`}>{category.title}</Link>
              </Badge>
            ))}
          </div>
        )}
        <ReadTime wordCount={post.wordCount} />
      </div>
    </div>
  );
}
