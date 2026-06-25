import { getDocumentLink } from '@/lib/links';
import type { ArticleListSectionFragmentType } from '@/lib/sanity/queries/schemas';
import { ArticleGridCard } from './ArticleGridCard';

export const ArticleGrid = ({
  section,
}: {
  section: ArticleListSectionFragmentType;
}) => {
  const { heading, articles } = section;
  return (
    <section className="border-line border-b bg-white pb-8 pt-7 max-w-7xl mx-auto px-5 lg:px-7">
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
            categoryHref={getDocumentLink({
              _type: 'category',
              slug: article.categories?.[0]?.slug,
            })}
            category={article.categories?.[0]?.title ?? ''}
            title={article.title}
            readTime={article.readTime}
          />
        ))}
      </div>
    </section>
  );
};
