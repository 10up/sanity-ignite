import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import { Page as PageType } from '@/sanity.types';
import { getPageQuery } from '@/sanity/queries/queries';
import { notFound } from 'next/navigation';
import PageSections from '@/components/PageSections';

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

  return formatMetaData(page.seo as unknown as SeoType);
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

  // TODO: maybe pass page instead (see Toby's project)
  const { _id, _type, pageSections } = page;

  return (
    <PageSections
      documentId={_id}
      documentType={_type}
      sections={pageSections as PageType['pageSections']}
    />
  );
}
