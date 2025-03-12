import { homePageQuery } from '@/sanity/queries/queries';
import { sanityFetch } from '@/sanity/lib/live';
import { formatMetaData } from '@/sanity/lib/seo';
import { Page as PageType } from '@/sanity.types';
import { SeoType } from '@/types/seo';
import { notFound } from 'next/navigation';
import PageSections from '@/components/PageSections';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(homePage.seo as unknown as SeoType);
}

export default async function Page() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;

  return (
    <PageSections
      documentId={_id}
      documentType={_type}
      sections={pageSections as PageType['pageSections']}
    />
  );
}
