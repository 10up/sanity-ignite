import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { homePageQuery } from '@/lib/sanity/queries/queries';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(homePage.seo, homePage?.name || '');
}

export default async function Page() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;

  return <PageSections documentId={_id} documentType={_type} sections={pageSections} />;
}
