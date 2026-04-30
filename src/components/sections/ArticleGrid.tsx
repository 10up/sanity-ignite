import Image from 'next/image';
import Link from 'next/link';
import { getDocumentLink } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  ArticleListSectionFragmentType,
  ImageFragmentType,
} from '@/lib/sanity/queries/schemas';
import { ArticleGridCard } from './ArticleGridCard';

export const ArticleGrid = ({
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
        {articles.map((article) => (
          <ArticleGridCard
            key={article._id}
            href={getDocumentLink({ _type: 'article', slug: article.slug })}
            image={article.image}
            kicker={article.categories?.[0]?.title ?? ''}
            title={article.title}
            read={article.readTime}
          />
        ))}
      </div>
    </section>
  );
};
