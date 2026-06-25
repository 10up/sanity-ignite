import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlockContent from '@/components/modules/BlockContent';
import { PageHero } from '@/components/sections/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { serverEnv } from '@/env/serverEnv';
import { buildPageSchema } from '@/lib/agent-readiness/structured-data';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  type LivePerspective,
} from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery, getPageSlugs } from '@/lib/sanity/queries/queries';
import { pageSchema, pageSlugsSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const cacheTags = (slug: string) => ['sanity:type:page', `sanity:slug:${slug}`];

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { perspective } = await getDynamicFetchOptions();
  const page = await fetchPageMeta(slug, perspective);

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(
    page.seo as Parameters<typeof formatMetaData>[0],
    page?.name || ''
  );
}

async function fetchPageMeta(slug: string, perspective: LivePerspective) {
  'use cache';
  return sanityFetch({
    query: getPageQuery,
    params: { slug },
    schema: pageSchema,
    tags: cacheTags(slug),
    perspective,
    stega: false,
  });
}

export async function generateStaticParams() {
  const slugs = await fetchPageSlugs();

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string) => ({ slug }))
    : [];
}

async function fetchPageSlugs() {
  'use cache';
  return sanityFetch({
    query: getPageSlugs,
    schema: pageSlugsSchema,
    params: { limit: serverEnv.MAX_STATIC_PARAMS },
    perspective: 'published',
    stega: false,
  });
}

export default async function Page(props: Props) {
  const { isEnabled } = await draftMode();

  if (isEnabled) {
    return (
      <Suspense fallback={null}>
        <DraftPage params={props.params} />
      </Suspense>
    );
  }

  const { slug } = await props.params;
  return <CachedPage slug={slug} perspective="published" stega={false} />;
}

async function DraftPage({ params }: Pick<Props, 'params'>) {
  const [{ slug }, options] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  return <CachedPage slug={slug} {...options} />;
}

async function CachedPage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  'use cache';

  const page = await sanityFetch({
    query: getPageQuery,
    params: { slug },
    schema: pageSchema,
    tags: cacheTags(slug),
    perspective,
    stega,
  });

  if (!page) {
    notFound();
  }

  return (
    <main id="main" aria-label={page.name ?? ''}>
      <JsonLd data={buildPageSchema(page)} />
      <PageHero title={page.name ?? ''} excerpt={page.excerpt ?? ''} />
      <div className="mx-auto max-w-4xl py-10">
        {page.content && <BlockContent value={page.content} />}
      </div>
    </main>
  );
}
