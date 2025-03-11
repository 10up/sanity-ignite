import { homePageQuery } from '@/sanity/queries/queries';
import { sanityFetch } from '@/sanity/lib/live';
import { formatSeoMetadata } from '@/sanity/lib/seo';
import { Page as PageType } from '@/sanity.types';
import PageRenderer from '@/components/Page';
import { SeoType } from '@/types/seo';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return formatSeoMetadata(homePage.seo as unknown as SeoType);
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
