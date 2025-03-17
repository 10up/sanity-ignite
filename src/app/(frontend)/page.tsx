import { homePageQuery } from '@/lib/sanity/queries/queries';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import PageSections from '@/components/sections/PageSections';
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

  return <PageSections pageSections={homePage.pageSections} />;
}
