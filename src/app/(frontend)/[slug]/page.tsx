import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery } from '@/lib/sanity/queries/queries';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
  });

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(page.seo, page?.name || '');
}

export default async function Page(props: Props) {
  const params = await props.params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
  });

  if (!page) {
    notFound();
  }

  const { _id, _type, pageSections } = page;

  return <PageSections documentId={_id} documentType={_type} sections={pageSections} />;
}
