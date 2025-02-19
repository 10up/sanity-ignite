import type { Metadata } from 'next';
import { fetch } from '@/sanity/lib/fetch';
import { formatMetaData } from '@/sanity/lib/seo';
import { SeoType } from '@/types/seo';
// import { type GetPageQueryResult, Page as PageType } from '@/sanity.types';
import PageRenderer from '@/components/Page';
import { getPageQuery } from '@/sanity/queries/queries';
//import { notFound } from 'next/headers'

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { data: page } = await fetch({
    live: true,
    query: getPageQuery,
    params,
    stega: false,
  });

  if (!page?.seo) {
    return {};
  }

  return formatMetaData(page.seo as unknown as SeoType);
}

export default async function Page(props: Props) {
  const params = await props.params;

  // const {data: page} = await fetch<NonNullable<GetPageQueryResult>>({
  const { data: page } = await fetch({
    live: true,
    query: getPageQuery,
    params,
  });

  if (!page) {
    //notFound()
    return;
  }

  return <PageRenderer page={page} />;
}
