import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { ImageFragmentType } from '@/lib/sanity/queries/schemas';

type ArticleHeroProps = {
  title: string;
  primaryCategory: string;
  excerpt: string;
  image?: ImageFragmentType | null | undefined;
  authorName: string;
  authorRole: string;
  authorImage?: ImageFragmentType | null | undefined;
};

export const ArticleHero = ({
  title,
  excerpt,
  primaryCategory,
  image,
  authorName,
  authorRole,
  authorImage,
}: ArticleHeroProps) => {
  return (
    <div className="space-y-10">
      <div className="bg-paper">
        <div className="max-w-4xl mx-auto pt-10 pb-4 space-y-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-primary/20 px-3 py-1.5 text-purple font-semibold uppercase tracking-widest text-xxs font-mono">
            {primaryCategory}
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tighter text-ink">
            {title}
          </h1>
          <p className="font-mono text-lg tracking-tight leading-relaxed text-p text-muted-ink">
            {excerpt}
          </p>
          <div className="flex items-center gap-3 border-t border-line text-sm pt-4">
            {authorImage ? (
              <Image
                width={40}
                height={40}
                src={
                  urlForImage(authorImage)?.width(40).height(40).url() as string
                }
                alt="Author"
                className="size-10 rounded-full object-cover"
              />
            ) : null}
            <div>
              <div className="font-semibold text-ink">{authorName}</div>
              <div className="text-xs text-muted-ink">{authorRole}</div>
            </div>
            <div className="ml-auto font-mono text-xs text-muted-ink">
              Apr 27, 2026 · 6 min read
            </div>
          </div>
        </div>
      </div>
      <div className="relative aspect-[16/7] w-full max-w-7xl mx-auto rounded-lg bg-paper overflow-hidden">
        {image && (
          <Image
            src={urlForImage(image)?.width(1280).height(600).url() as string}
            alt={image?.alt ?? ''}
            fill
            className="object-cover object-center"
            loading="eager"
          />
        )}
      </div>
    </div>
  );
};
