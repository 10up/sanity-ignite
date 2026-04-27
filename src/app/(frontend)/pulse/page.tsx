import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Banner } from '@/components/layout/Banner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/HomeHero';
import { NewsletterSubscribe } from '@/components/sections/NewsletterSubscribe';
import PageSections from '@/components/sections/PageSections';
import { TopStories } from '@/components/sections/pulse/TopStories';
import { TwoColumnFeed } from '@/components/sections/TwoColumnFeed';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { formatMetaData } from '@/lib/sanity/client/seo';
import { homePageQuery } from '@/lib/sanity/queries/queries';
import { homePageSchema } from '@/lib/sanity/queries/schemas';

const fetchOptions = {
  query: homePageQuery,
  schema: homePageSchema,
  cache: { profile: 'days' as CacheProfile, tags: ['sanity:type:homePage'] },
};

export async function generateMetadata() {
  // const homePage = await sanityFetch(fetchOptions);
  // if (!homePage?.seo) {
  //   return {};
  // }
  // return formatMetaData(
  //   homePage.seo as Parameters<typeof formatMetaData>[0],
  //   homePage?.name || ''
  // );
}

export default async function Page() {
  // const homePage = await sanityFetch(fetchOptions);

  // if (!homePage) {
  //   notFound();
  // }

  // const { _id, _type, pageSections } = homePage;

  return (
    <div>
      <Hero />
      <TopStories />
      <TwoColumnFeed
        leftHeading="Latest Stories"
        rightHeading="Recommended for you"
      />
      <NewsletterSubscribe />
      <Footer />
    </div>
  );
}
