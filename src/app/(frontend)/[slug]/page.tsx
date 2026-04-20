import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { getPageQuery } from '@/lib/sanity/queries/queries';
import { pageSchema_ } from '@/lib/sanity/queries/schemas';

type Props = {
  params: Promise<{ slug: string }>;
};

const fetchPage = async (slug: string) =>
  sanityFetch({
    query: getPageQuery,
    params: { slug },
    schema: pageSchema_,
    cache: {
      profile: 'hours',
      tags: ['sanity:type:page', `sanity:slug:${slug}`],
    },
  });

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await fetchPage(slug);

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(
    page.seo as Parameters<typeof formatMetaData>[0],
    page?.name || ''
  );
}

export default async function Page(props: Props) {
  const { slug } = await props.params;
  const page = await fetchPage(slug);

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
