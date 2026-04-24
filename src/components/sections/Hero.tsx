import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DateComponent } from '@/components/ui/Date';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { HeroSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export const Hero = ({ section }: { section: HeroSectionFragmentType }) => {
  console.log({ section });
  const { kicker, heading, tagline, article } = section;
  const articleImage = urlForImage(article?.image)
    ?.width(1000)
    .height(667)
    .url();
  const authorImage = urlForImage(article?.author?.image)
    ?.width(128)
    .height(128)
    .url();
  return (
    <section className="relative overflow-hidden bg-ink px-7 pb-11 pt-10 text-paper">
      {/* Accent wash — approximate prior radial grain with token-friendly gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/15"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 font-mono text-purple text-xs font-medium uppercase tracking-widest">
            {kicker}
          </div>

          <h1 className="font-display my-4.5 text-6xl font-extrabold leading-none tracking-tight text-paper lg:text-7xl text-balance">
            {heading}
          </h1>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-on-dark">
            {tagline}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3.5 text-xs">
            {authorImage && (
              <Image
                src={authorImage}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full object-cover"
              />
            )}
            <span className="font-semibold text-paper">
              {article?.author?.firstName} {article?.author?.lastName}
            </span>
            <DateComponent dateString={article?.date} />
            <span className="text-muted-on-dark font-mono text-xs">
              {article?.readTime} min read
            </span>
            <Link
              href={`/article/${article?.slug}`}
              className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-paper px-3.5 py-1.5 font-semibold text-ink text-xs"
            >
              Read story
              <ArrowRight className="size-3" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line-dark">
          {articleImage && (
            <Image
              src={articleImage}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42rem, 100vw"
            />
          )}
        </div>
      </div>
    </section>
  );
};
