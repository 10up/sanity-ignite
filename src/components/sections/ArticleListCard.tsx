import Image from 'next/image';
import Link from 'next/link';
import { DateComponent } from '@/components/ui/Date';
import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ImageFragmentType,
  PersonFragmentType,
} from '@/lib/sanity/queries/schemas';

export type ArticleListCardProps = {
  category: string;
  categoryHref: string;
  title: string;
  excerpt: string;
  author?: PersonFragmentType;
  date: string;
  readTime: string | number | undefined | null;
  href: string;
  image: ImageFragmentType | null | undefined;
};

export const ArticleListCard = ({
  category,
  categoryHref,
  title,
  excerpt,
  author,
  date,
  readTime,
  href,
  image,
}: ArticleListCardProps) => {
  return (
    <article className="grid grid-cols-[1fr_180px] items-start gap-5 border-line border-b py-4.5">
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
          <Link
            href={categoryHref}
            className="text-xxs font-bold tracking-wider uppercase text-purple hover:underline"
          >
            {category}
          </Link>
        </div>
        <h3 className="mb-2 font-bold leading-snug tracking-tight text-ink text-xl text-pretty hover:underline">
          <Link href={href}>{title}</Link>
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
        <div className="flex items-center gap-2.5 text-muted-foreground">
          {author?.image ? (
            <Image
              src={
                urlForImage(author?.image)
                  ?.width(56)
                  .height(56)
                  // biome-ignore lint/suspicious/noFocusedTests: false positive — .fit() is a Sanity image builder method
                  .fit('crop')
                  .url() ?? ''
              }
              alt={author?.image?.alt ?? ''}
              width={28}
              height={28}
              className="size-5 shrink-0 rounded-full object-cover"
            />
          ) : null}
          {author?.firstName && author?.lastName ? (
            <span className="font-semibold text-xs">
              {author.firstName} {author.lastName}
            </span>
          ) : null}
          <span className="font-mono text-xs text-muted-ink">
            <DateComponent dateString={date} />· {readTime ?? 3} min read
          </span>
        </div>
      </div>
      {image ? (
        <Link
          href={href}
          className="relative aspect-[4/3] size-full overflow-hidden rounded"
        >
          <Image
            src={urlForImage(image)?.width(180).height(180).url() ?? ''}
            alt={image?.alt ?? ''}
            fill
            className="object-cover"
            sizes="180px"
            loading="lazy"
          />
        </Link>
      ) : (
        <Link
          href={href}
          className="relative aspect-[4/3] w-full overflow-hidden rounded"
        >
          <div className="absolute inset-0 bg-paper" />
        </Link>
      )}
    </article>
  );
};
