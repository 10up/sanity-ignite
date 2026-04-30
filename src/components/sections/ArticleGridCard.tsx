import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { ImageFragmentType } from '@/lib/sanity/queries/schemas';

export type ArticleGridCardProps = {
  href: string;
  image: ImageFragmentType | null | undefined;
  kicker: string;
  title: string;
  read?: number | null;
};

export const ArticleGridCard = ({
  href,
  image,
  kicker,
  title,
  read,
}: ArticleGridCardProps) => {
  return (
    <Link
      href={href}
      className="group block rounded-md outline-none ring-offset-2 ring-offset-paper focus-visible:ring-2 focus-visible:ring-ring"
    >
      <article>
        <div className="relative mb-3 aspect-video overflow-hidden rounded-md">
          {image ? (
            <Image
              src={urlForImage(image)?.width(600).height(400).url() ?? ''}
              alt={image.alt ?? ''}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-95"
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-paper" />
          )}
        </div>
        <div className="text-xxs font-bold tracking-wider uppercase text-purple">
          {kicker}
        </div>
        <h3 className="my-1 text-balance font-bold leading-snug tracking-tight text-ink">
          {title}
        </h3>
        {read ? (
          <p className="font-mono text-muted-ink text-xs">{read} min read</p>
        ) : null}
      </article>
    </Link>
  );
};
