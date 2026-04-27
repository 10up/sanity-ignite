import Image from 'next/image';
import Link from 'next/link';
import { DateComponent } from '@/components/ui/Date';
import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ImageFragmentType,
  PersonFragmentType,
} from '@/lib/sanity/queries/schemas';

export type ArticleCardProps = {
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

export const ArticleCard = ({
  category,
  categoryHref,
  title,
  excerpt,
  author,
  date,
  readTime,
  href,
  image,
}: ArticleCardProps) => {
  return (
    <article className="grid grid-cols-[1fr_180px] items-start gap-5 border-line border-b py-4.5">
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
          <Link
            href={categoryHref}
            className="font-semibold text-purple text-xs tracking-wide hover:underline"
          >
            {category}
          </Link>
        </div>
        <h3 className="mb-2 text-balance font-bold text-xl leading-snug tracking-tight text-ink">
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
            <DateComponent dateString={date} />· {readTime} min read
          </span>
        </div>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded">
        {image ? (
          <Link href={href}>
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
          <Link href={href}>
            <div className="absolute inset-0 bg-paper" />
          </Link>
        )}
      </div>
    </article>
  );
};
