import '../globals.css';

import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { Suspense } from 'react';
import { Banner } from '@/components/layout/Banner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { NewsletterSubscribe } from '@/components/sections/NewsletterSubscribe';
import { SanityLive } from '@/lib/sanity/client/live';
import { handleError } from './client-utils';

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
      <NuqsAdapter>
        <section className="min-h-screen">
          <Toaster />
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
      </NuqsAdapter>
    </body>
  );
}
