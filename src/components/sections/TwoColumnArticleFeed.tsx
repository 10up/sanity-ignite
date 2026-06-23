import { Suspense } from 'react';
import { ArticleListCard } from '@/components/sections/ArticleListCard';
import { getDocumentLink } from '@/lib/links';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from '@/lib/sanity/client/live';
import {
  latestArticlesQuery,
  latestCategoryArticlesQuery,
} from '@/lib/sanity/queries/queries';
import { articlesArchiveSchema } from '@/lib/sanity/queries/schemas';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from './RecommendedArticleList';

// Dynamic island: resolves draft mode / perspective at request time, then
// renders a cached child. Render inside a <Suspense> boundary when nested under
// cached content (e.g. the category page).
export const TwoColumnArticleFeed = async ({
  categorySlug,
  size = 10,
}: {
  categorySlug?: string;
  size?: number;
}) => {
  const options = await getDynamicFetchOptions();
  return (
    <CachedTwoColumnArticleFeed
      categorySlug={categorySlug}
      size={size}
      {...options}
    >
      <Suspense fallback={<RecommendedArticleListSkeleton />}>
        <RecommendedArticleList />
      </Suspense>
    </CachedTwoColumnArticleFeed>
  );
};

const CachedTwoColumnArticleFeed = async ({
  categorySlug,
  size,
  children,
  perspective,
  stega,
}: {
  categorySlug?: string;
  size: number;
  children: React.ReactNode;
} & DynamicFetchOptions) => {
  'use cache';

  const query = categorySlug
    ? latestCategoryArticlesQuery
    : latestArticlesQuery;
  const latestArticles = await sanityFetch({
    query,
    schema: articlesArchiveSchema,
    tags: ['sanity:type:article'],
    params: categorySlug ? { categorySlug, size } : { size },
    perspective,
    stega,
  });

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_320px] lg:gap-x-8">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2.5 text-sm font-mono font-semibold uppercase tracking-wide text-ink">
          <span aria-hidden className="h-4 w-1 shrink-0 rounded-sm bg-purple" />
          Latest stories
        </h2>
        <div className="*:last-of-type:border-b-0">
          {latestArticles?.map((article) => (
            <ArticleListCard
              key={article._id}
              category={article.categories?.[0]?.title ?? ''}
              categoryHref={getDocumentLink({
                _type: 'category',
                slug: article.categories?.[0]?.slug ?? '',
              })}
              title={article.title}
              excerpt={article.excerpt ?? ''}
              author={article.author ?? undefined}
              date={article.date ?? ''}
              readTime={article.readTime ?? ''}
              image={article.image}
              href={getDocumentLink({ _type: 'article', slug: article.slug })}
            />
          ))}
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
};
