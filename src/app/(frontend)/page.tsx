import { homePageQuery } from '@/sanity/queries/queries';
import { sanityFetch } from '@/sanity/lib/live';
import { formatMetaData } from '@/sanity/lib/seo';
import { Page as PageType } from '@/sanity.types';
import PageRenderer from '@/components/templates/Page';
import { notFound } from 'next/navigation';
import { SeoType } from '@/types/seo';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(homePage.seo as unknown as SeoType, homePage?.name || '');
}

export default async function Page() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage) {
    notFound();
  }

  return <PageRenderer pageSections={homePage.pageSections as PageType['pageSections']} />;
}
