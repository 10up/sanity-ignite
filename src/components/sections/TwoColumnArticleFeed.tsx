import { ArticleListCard } from '@/components/sections/ArticleListCard';
import { getDocumentLink } from '@/lib/links';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import type { DynamicFetchOptions } from '@/lib/sanity/client/live';
import {
  latestArticlesQuery,
  latestCategoryArticlesQuery,
} from '@/lib/sanity/queries/queries';
import { articlesArchiveSchema } from '@/lib/sanity/queries/schemas';
import { tag } from '@/lib/sanity/revalidation';

// Cached component: receives `perspective`/`stega` from the parent (the "dynamic"
// layer resolves them once, outside any cache boundary). The personalized
// sidebar is slotted in as `children` because it reads a per-user cookie and
// must stay a dynamic island — render it inside a <Suspense> at the call site.
export const TwoColumnArticleFeed = async ({
  categorySlug,
  size = 10,
  children,
  perspective,
  stega,
}: {
  categorySlug?: string;
  size?: number;
  children: React.ReactNode;
} & DynamicFetchOptions) => {
  'use cache';

  const query = categorySlug
    ? latestCategoryArticlesQuery
    : latestArticlesQuery;
  // The category list also carries a category-scoped tag so an article webhook
  // can purge just the categories that article belongs to (see getRevalidateTags).
  const tags = categorySlug
    ? [tag.type('article'), tag.category(categorySlug)]
    : [tag.type('article')];
  const latestArticles = await sanityFetch({
    query,
    schema: articlesArchiveSchema,
    tags,
    params: categorySlug ? { categorySlug, size } : { size },
    perspective,
    stega,
  });

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-10 lg:grid-cols-[1fr_320px] lg:gap-x-8 lg:px-7">
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
