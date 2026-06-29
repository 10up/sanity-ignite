import Link from 'next/link';
import { Image } from 'next-sanity/image';
import { DateComponent } from '@/components/ui/Date';
import { Badge } from '@/components/ui/shadcn/badge';
import { getDocumentLink } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { ArticleFragmentType } from '@/lib/sanity/queries/schemas';

export default function Byline({ post }: { post: ArticleFragmentType }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div className="flex items-center">
        {post.author?.image?.asset?._ref ? (
          <div className="mr-4 h-9 w-9">
            <Image
              alt={post.author?.image?.alt || ''}
              className="h-full rounded-full object-cover"
              height={48}
              width={48}
              src={
                urlForImage(post.author?.image)
                  ?.height(96)
                  .width(96)
                  // biome-ignore lint/suspicious/noFocusedTests: false positive — .fit() is a Sanity image builder method
                  .fit('crop')
                  .url() as string
              }
            />
          </div>
        ) : (
          <div className="mr-1">By </div>
        )}
        <div className="flex flex-col">
          {post.author?.firstName && post.author?.lastName ? (
            <span className="font-bold">
              {post.author.firstName} {post.author.lastName}
            </span>
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
                <Link
                  href={getDocumentLink({
                    _type: 'category',
                    slug: category.slug,
                  })}
                >
                  {category.title}
                </Link>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
