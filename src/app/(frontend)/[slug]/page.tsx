import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery, pageSlugs } from '@/lib/sanity/queries/queries';
import { pageSchema_ } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const pageFetchOptions = (slug: string) => ({
  query: getPageQuery,
  params: { slug },
  schema: pageSchema_,
  cache: {
    profile: 'hours' as const,
    tags: ['sanity:type:page', `sanity:slug:${slug}`],
  },
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await sanityFetch(pageFetchOptions(slug));

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(
    page.seo as Parameters<typeof formatMetaData>[0],
    page?.name || ''
  );
}

export async function generateStaticParams() {
  const slugs = await client.fetch(pageSlugs, {
    limit: serverEnv.MAX_STATIC_PARAMS,
  });

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string) => ({ slug }))
    : [];
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const page = await sanityFetch(pageFetchOptions(slug));

  if (!page) {
    notFound();
  }

  const { _id, _type, pageSections } = page;

  return (
    <PageSections
      documentId={_id}
      documentType={_type}
      sections={pageSections}
    />
  );
}
