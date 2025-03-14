import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { formatMetaData } from '@/sanity/lib/seo';
import { Page as PageType } from '@/sanity.types';
import PageSections from '@/components/PageSections';
import { getPageQuery } from '@/sanity/queries/queries';
import { notFound } from 'next/navigation';
import { SeoType } from '@/types/seo';

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

  return formatMetaData(page.seo as unknown as SeoType, page?.name || '');
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

  return <PageSections sections={page.pageSections as PageType['pageSections']} />;
}
