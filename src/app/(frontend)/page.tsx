import { homePageQuery } from '@/sanity/queries/queries';
import { fetch } from '@/sanity/lib/fetch';
import { formatMetaData } from '@/sanity/lib/seo';
import { HomePage } from '@/sanity.types';
import PageRenderer from '@/components/Page';
import { SeoType } from '@/types/seo';

export async function generateMetadata() {
  const { data: homePage } = await fetch({
    live: true,
    query: homePageQuery,
    stega: false,
  });
  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(homePage.seo as unknown as SeoType);
}

export default async function Page() {
  const { data: homePage } = await fetch({
    live: true,
    query: homePageQuery,
  });

  if (!homePage) {
    return null;
  }

  return <PageRenderer page={homePage as unknown as HomePage} />;
}
