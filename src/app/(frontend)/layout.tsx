import '../globals.css';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import { Suspense } from 'react';
import { Banner } from '@/components/layout/Banner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { NewsletterSubscribe } from '@/components/sections/NewsletterSubscribe';
import { SiteJsonLd } from '@/components/seo/SiteJsonLd';
import { SanityLive } from '@/lib/sanity/client/live';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { handleError } from './client-utils';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'RSS feed' }],
      'application/feed+json': [{ url: '/feed.json', title: 'JSON feed' }],
    },
  },
};

const DraftModeToast = dynamic(
  () => import('@/components/modules/DraftModeToast')
);
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster));
const VisualEditing = dynamic(() =>
  import('next-sanity/visual-editing').then((mod) => mod.VisualEditing)
);

// Runtime-only — reads draftMode(), never prerenders
async function DraftModeTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <>
      <DraftModeToast />
      <VisualEditing />
      {/* With `includeDrafts`, Sanity Live defaults its action to `router.refresh()`,
          so editor changes stream into the preview without a custom handler. */}
      <SanityLive includeDrafts onError={handleError} />
    </>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <section className="min-h-screen">
        <Toaster />
        <Suspense fallback={null}>
          <SiteJsonLd />
        </Suspense>
        <Suspense fallback={null}>
          <DraftModeTools />
        </Suspense>
        <Banner />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <Suspense fallback={null}>
          <Main>{children}</Main>
        </Suspense>
        <NewsletterSubscribe />
        <Footer />
      </section>
    </body>
  );
}
