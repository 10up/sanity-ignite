import { TrendingUp } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ALLOWED_COUNTRIES } from '@/lib/fixtures/countries';
import { getDocumentLink } from '@/lib/links';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
} from '@/lib/sanity/client/live';
import { recommendedArticlesQuery } from '@/lib/sanity/queries/queries';
import { articlesArchiveSchema } from '@/lib/sanity/queries/schemas';

// Dynamic island: reads the country cookie (and draft mode) at request time,
// then hands serializable props to a cached child. Always render this inside a
// <Suspense> boundary so it can stream in below cached content.
export const RecommendedArticleList = async () => {
  const cookieStore = await cookies();
  const countryCookie = cookieStore.get('x-user-country')?.value ?? 'US';
  const country = ALLOWED_COUNTRIES.includes(
    countryCookie as (typeof ALLOWED_COUNTRIES)[number]
  )
    ? countryCookie
    : ALLOWED_COUNTRIES[0];

  const options = await getDynamicFetchOptions();
  return <CachedRecommendedArticleList country={country} {...options} />;
};

const CachedRecommendedArticleList = async ({
  country,
  perspective,
  stega,
}: { country: string } & DynamicFetchOptions) => {
  'use cache';

  const recommendedArticles = await sanityFetch({
    query: recommendedArticlesQuery,
    params: { country },
    schema: articlesArchiveSchema,
    tags: ['sanity:type:article'],
    perspective,
    stega,
  });

  return (
    <aside aria-label={`Recommended stories in ${country}`}>
      <div className="sticky top-5">
        <div className="rounded-lg bg-paper p-4.5 pb-1">
          <div className="mb-3 flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wide">
            <TrendingUp
              className="size-3.5 shrink-0"
              aria-hidden
              strokeWidth={2}
            />
            Recommended stories in {country}
          </div>
          <ol className="divide-y divide-line">
            {recommendedArticles?.map((item, i) => (
              <li
                key={item._id}
                className="flex items-baseline gap-3 py-3 first:pt-0"
              >
                <span className="min-w-5 shrink-0 font-mono text-muted-ink text-xs leading-snug tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link
                  href={getDocumentLink({ _type: 'article', slug: item.slug })}
                  className="font-medium text-sm leading-snug text-ink hover:underline hover:text-ink/80 transition-colors"
                  prefetch={false}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
};

export const RecommendedArticleListSkeleton = () => {
  return (
    <div className="rounded-lg bg-paper p-4.5 pb-1">
      <div className="mb-3 flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wide">
        <TrendingUp className="size-3.5 shrink-0" aria-hidden strokeWidth={2} />
        Finding stories ...
      </div>
      <ol className="divide-y divide-line" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <li
            key={`skeleton-item-${
              // biome-ignore lint/suspicious/noArrayIndexKey: index is fine here, static list
              i
            }`}
            className="flex items-baseline gap-3 py-3 first:pt-0"
          >
            <div
              className="skeleton-shimmer min-h-4 min-w-5 shrink-0 rounded-sm"
              style={{ animationDelay: `${i * 75}ms` }}
            />
            <div
              className="skeleton-shimmer h-4 flex-1 rounded-sm"
              style={{
                animationDelay: `${i * 75}ms`,
                maxWidth: `${68 + (i % 4) * 8}%`,
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
