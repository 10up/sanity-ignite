import { notFound } from 'next/navigation';
import PageSections from '@/components/sections/PageSections';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { homePageQuery } from '@/lib/sanity/queries/queries';
import { homePageSchema } from '@/lib/sanity/queries/schemas';

const fetchOptions = {
  query: homePageQuery,
  schema: homePageSchema,
  cache: { profile: 'hours' as const, tags: ['sanity:type:homePage'] },
};

export async function generateMetadata() {
  const homePage = await sanityFetch(fetchOptions);

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(
    homePage.seo as Parameters<typeof formatMetaData>[0],
    homePage?.name || ''
  );
}

export default async function Page() {
  const homePage = await sanityFetch(fetchOptions);

  if (!homePage) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;

  return (
    <PageSections
      documentId={_id}
      documentType={_type}
      sections={pageSections}
    />
  );
}
