import { Image } from 'next-sanity/image';

import { urlForImage } from '@/sanity/lib/utils';
import DateComponent from '@/components/Date';
import { PostsArchiveQueryResult } from '@/sanity.types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ReadTime from '@/components/ReadTime';
import { type PortableTextBlock } from 'next-sanity';
export default function Byline({ post }: { post: PostsArchiveQueryResult['results'][number] }) {
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
          {post.author?.firstName && post.author?.lastName && (
            <div className="font-bold">
              {post.author?.firstName} {post.author?.lastName}
            </div>
          )}
          <div className="text-gray-500 text-sm">
            <DateComponent dateString={post.date} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {post.categories && post.categories?.length > 0 && (
          <div className="flex items-center gap-2">
            {post.categories.map((category) => (
              <Badge variant="default" asChild key={category._id}>
                <Link href={`/category/${category.slug}`}>{category.title}</Link>
              </Badge>
            ))}
          </div>
        )}
        <ReadTime content={(post.content as PortableTextBlock[]) || []} />
      </div>
    </div>
  );
}
