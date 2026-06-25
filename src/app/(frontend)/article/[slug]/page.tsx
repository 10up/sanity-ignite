import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod';
import { ArticleHero } from '@/components/modules/ArticleHero';
import BlockContent from '@/components/modules/BlockContent';
import {
  RecommendedArticleList,
  RecommendedArticleListSkeleton,
} from '@/components/sections/RecommendedArticleList';
import { JsonLd } from '@/components/seo/JsonLd';
import { serverEnv } from '@/env/serverEnv';
import { buildArticleSchema } from '@/lib/agent-readiness/structured-data';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  type LivePerspective,
} from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { articleQuery, articleSlugs } from '@/lib/sanity/queries/queries';
import { articleSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const cacheTags = (slug: string) => [
  'sanity:type:article',
  `sanity:slug:${slug}`,
];

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { perspective } = await getDynamicFetchOptions();
  const article = await fetchArticleMeta(slug, perspective);

  if (!article?.seo) {
    return {};
  }

  return formatMetaData(
    article.seo as Parameters<typeof formatMetaData>[0],
    article?.title || ''
  );
}

async function fetchArticleMeta(slug: string, perspective: LivePerspective) {
  'use cache';
  return sanityFetch({
    query: articleQuery,
    params: { slug },
    schema: articleSchema,
    tags: cacheTags(slug),
    perspective,
    stega: false,
  });
}

export async function generateStaticParams() {
  'use cache';
  const slugs = await sanityFetch({
    query: articleSlugs,
    schema: z.array(z.string()),
    params: { limit: serverEnv.MAX_STATIC_PARAMS },
    perspective: 'published',
    stega: false,
  });

  if (!slugs) {
    return [];
  }

  return slugs.map((slug) => ({ slug }));
}

export default async function Article(props: Props) {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <DraftArticle params={props.params} />
      </Suspense>
    );
  }

  const { slug } = await props.params;
  return (
    <CachedArticle slug={slug} perspective="published" stega={false}>
      <Suspense fallback={<RecommendedArticleListSkeleton />}>
        <RecommendedArticleList />
      </Suspense>
    </CachedArticle>
  );
}

async function DraftArticle({ params }: Pick<Props, 'params'>) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return (
    <CachedArticle slug={slug} {...options}>
      <Suspense fallback={<RecommendedArticleListSkeleton />}>
        <RecommendedArticleList />
      </Suspense>
    </CachedArticle>
  );
}

async function CachedArticle({
  slug,
  children,
  perspective,
  stega,
}: { slug: string; children: React.ReactNode } & DynamicFetchOptions) {
  'use cache';

  const article = await sanityFetch({
    query: articleQuery,
    params: { slug },
    schema: articleSchema,
    tags: cacheTags(slug),
    perspective,
    stega,
  });

  if (!article) {
    notFound();
  }

  return (
    <article id="main" aria-label={article.title}>
      <JsonLd data={buildArticleSchema(article)} />
      <ArticleHero
        title={article.title}
        excerpt={article.excerpt ?? ''}
        primaryCategory={article.categories?.[0]?.title ?? ''}
        authorName={`${article.author?.firstName ?? ''} ${article.author?.lastName ?? ''}`}
        authorRole={article.author?.role ?? ''}
        authorImage={article.author?.image}
        image={article.image}
        readTime={article.readTime ?? 3}
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 px-5 py-10 lg:grid-cols-[1fr_320px] lg:gap-x-8 lg:px-7">
        <div className="min-w-0">
          {article.content && <BlockContent value={article.content} />}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </article>
  );
}
