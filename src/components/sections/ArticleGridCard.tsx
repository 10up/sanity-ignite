import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { ImageFragmentType } from '@/lib/sanity/queries/schemas';

export type ArticleGridCardProps = {
  href: string;
  image: ImageFragmentType | null | undefined;
  category: string;
  title: string;
  readTime?: number | null;
  categoryHref: string;
};

export const ArticleGridCard = ({
  href,
  categoryHref,
  image,
  category,
  title,
  readTime,
}: ArticleGridCardProps) => {
  return (
    <article>
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-paper">
        <Link href={href} className="relative block size-full">
          {image ? (
            <Image
              src={urlForImage(image)?.width(640).height(360).url() ?? ''}
              alt={image.alt ?? ''}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-95"
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-paper" />
          )}
        </Link>
      </div>
      <Link
        href={categoryHref}
        className="text-xxs font-bold tracking-wider uppercase text-purple hover:underline"
      >
        {category}
      </Link>
      <h3 className="my-1 text-balance font-bold leading-snug tracking-tight text-ink hover:underline">
        <Link href={href}>{title}</Link>
      </h3>
      <p className="font-mono text-muted-ink text-xs">
        {readTime || 3} min read
      </p>
    </article>
  );
};
