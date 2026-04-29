import Image from 'next/image';
import Link from 'next/link';
import { getDocumentLink } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ArticleListSectionFragmentType,
  ImageFragmentType,
} from '@/lib/sanity/queries/schemas';

export const TopStories = ({
  section,
}: {
  section: ArticleListSectionFragmentType;
}) => {
  const { heading, articles } = section;
  return (
    <section className="border-line border-b bg-white pb-8 pt-7 max-w-7xl mx-auto">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2.5 text-sm font-mono font-semibold uppercase tracking-wide text-ink">
          <span aria-hidden className="h-4 w-1 shrink-0 rounded-sm bg-purple" />
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article, i) => (
          <TopStoryCard
            key={article._id}
            href={getDocumentLink({ _type: 'article', slug: article.slug })}
            image={article.image}
            kicker={article.categories?.[0]?.title ?? ''}
            title={article.title}
            read={article.readTime}
            featured={i === 0}
          />
        ))}
      </div>
    </section>
  );
};

export type TopStoryCardProps = {
  href: string;
  image: ImageFragmentType | null | undefined;
  kicker: string;
  title: string;
  read?: number | null;
  featured?: boolean;
};

const TopStoryCard = ({
  href,
  image,
  kicker,
  title,
  read,
  featured = false,
}: TopStoryCardProps) => {
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
          {featured ? (
            <span className="absolute left-2.5 top-2.5 rounded bg-purple px-2 py-1 font-semibold text-primary-foreground text-xs uppercase tracking-wide">
              Featured
            </span>
          ) : null}
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
