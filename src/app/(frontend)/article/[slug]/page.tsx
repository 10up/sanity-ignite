import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod';
import { ArticleHero } from '@/components/modules/ArticleHero';
import BlockContent from '@/components/modules/BlockContent';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from '@/components/sections/RecommendedArticleList';
import { serverEnv } from '@/env/serverEnv';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { articleQuery, articleSlugs } from '@/lib/sanity/queries/queries';
import { articleSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const articleFetchOptions = (slug: string) => ({
  query: articleQuery,
  params: { slug },
  schema: articleSchema,
  cache: {
    profile: 'days' as CacheProfile,
    tags: [`sanity:type:article`, `sanity:slug:${slug}`],
  },
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await sanityFetch({
    ...articleFetchOptions(slug),
    bypassLiveFetch: true,
  });

  if (!article?.seo) {
    return {};
  }

  return formatMetaData(
    article.seo as Parameters<typeof formatMetaData>[0],
    article?.title || ''
  );
}

export async function generateStaticParams() {
  const slugs = await sanityFetch({
    query: articleSlugs,
    schema: z.array(z.string()),
    params: {
      limit: serverEnv.MAX_STATIC_PARAMS,
    },
    bypassLiveFetch: true,
  });

  if (!slugs) {
    return [];
  }

  return slugs.map((slug) => ({ slug }));
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const article = await sanityFetch(articleFetchOptions(slug));

  if (!article) {
    notFound();
  }

  return (
    <article id="main" aria-label={article.title}>
      <ArticleHero
        title={article.title}
        excerpt={article.excerpt ?? ''}
        primaryCategory={article.categories?.[0]?.title ?? ''}
        authorName={`${article.author?.firstName ?? ''} ${article.author?.lastName ?? ''}`}
        authorRole={article.author?.role ?? ''}
        authorImage={article.author?.image}
        image={article.image}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[1fr_320px] lg:gap-x-8 py-10">
        <div className="min-w-0">
          {article.content && <BlockContent value={article.content} />}
        </div>
        <div className="min-w-0">
          <Suspense fallback={<RecommendedArticleListSkeleton />}>
            <RecommendedArticleList />
          </Suspense>
        </div>
      </div>
    </article>
  );
}
