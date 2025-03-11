import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/live';
import { formatSeoMetadata } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
import { Page as PageType } from '@/sanity.types';
import PageRenderer from '@/components/Page';
import { getPageQuery } from '@/sanity/queries/queries';
import { notFound } from 'next/navigation';

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

  return formatSeoMetadata(page.seo);
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

  return <PageRenderer pageSections={page.pageSections as PageType['pageSections']} />;
}
