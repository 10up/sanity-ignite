import { TrendingUp } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ALLOWED_COUNTRIES } from '@/lib/fixtures/countries';
import { getDocumentLink } from '@/lib/links';
import { type CacheProfile, sanityFetch } from '@/lib/sanity/client/fetch';
import { recommendedArticlesQuery } from '@/lib/sanity/queries/queries';
import { articlesArchiveSchema } from '@/lib/sanity/queries/schemas';

export const RecommendedArticleList = async () => {
  const cookieStore = await cookies();
  const countryCookie = cookieStore.get('x-user-country')?.value ?? 'US';
  const country = ALLOWED_COUNTRIES.includes(
    countryCookie as (typeof ALLOWED_COUNTRIES)[number]
  )
    ? countryCookie
    : ALLOWED_COUNTRIES[0];

  const recommendedArticles = await sanityFetch({
    query: recommendedArticlesQuery,
    params: { country },
    schema: articlesArchiveSchema,
    cache: { profile: 'days' as CacheProfile, tags: ['sanity:type:article'] },
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
    <div className="rounded-lg bg-paper p-4.5 pb-1 h-64">
      <div className="mb-3 flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wide">
        <TrendingUp className="size-3.5 shrink-0" aria-hidden strokeWidth={2} />
        Recommended stories for you
      </div>
    </div>
  );
};
