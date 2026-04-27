import { Suspense } from 'react';
import { ArticleCard } from '@/components/sections/ArticleCard';
import { getDocumentLink } from '@/lib/links';
import { type CacheProfile, sanityFetch } from '@/lib/sanity/client/fetch';
import { latestArticlesQuery } from '@/lib/sanity/queries/queries';
import { articlesArchiveSchema } from '@/lib/sanity/queries/schemas';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from './RecommendedArticleList';

export const HomeArticleFeed = async () => {
  const latestArticles = await sanityFetch({
    query: latestArticlesQuery,
    schema: articlesArchiveSchema,
    cache: { profile: 'days' as CacheProfile, tags: ['sanity:type:article'] },
  });

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_320px] lg:gap-x-8">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2.5 font-bold tracking-tight text-ink">
          <span aria-hidden className="h-4 w-1 shrink-0 rounded-sm bg-purple" />
          Latest stories
        </h2>
        <div className="*:last-of-type:border-b-0">
          {latestArticles?.map((article) => (
            <ArticleCard
              key={article._id}
              category={article.categories?.[0]?.title ?? ''}
              categoryHref={getDocumentLink({
                _type: 'category',
                slug: article.categories?.[0]?.slug,
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
      <div className="min-w-0">
        <Suspense fallback={<RecommendedArticleListSkeleton />}>
          <RecommendedArticleList />
        </Suspense>
      </div>
    </section>
  );
};
