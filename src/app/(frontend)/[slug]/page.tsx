import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { serverEnv } from '@/env/serverEnv';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery, getPageSlugs } from '@/lib/sanity/queries/queries';
import { pageSchema, pageSlugsSchema } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchOptions = (slug: string) => ({
  query: getPageQuery,
  params: { slug },
  schema: pageSchema,
  cache: {
    profile: 'days' as CacheProfile,
    tags: ['sanity:type:page', `sanity:slug:${slug}`],
  },
  bypassLiveFetch: true,
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await sanityFetch(fetchOptions(slug));

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(
    page.seo as Parameters<typeof formatMetaData>[0],
    page?.name || ''
  );
}

export async function generateStaticParams() {
  const slugs = await sanityFetch({
    query: getPageSlugs,
    schema: pageSlugsSchema,
    params: {
      limit: serverEnv.MAX_STATIC_PARAMS,
    },
    bypassLiveFetch: true,
  });

  return slugs
    ? slugs
        .filter((slug: string | null) => slug !== null)
        .map((slug: string) => ({ slug }))
    : [];
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const page = await sanityFetch(fetchOptions(slug));

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
