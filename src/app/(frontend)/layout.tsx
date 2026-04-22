import '../globals.css';

import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next';
import { Suspense } from 'react';
import Alert from '@/components/layout/Alert';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { SanityLive } from '@/lib/sanity/client/live';
import { handleError, sanityLiveRevalidateSyncTags } from './client-utils';

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
      <SanityLive
        onError={handleError}
        revalidateSyncTags={sanityLiveRevalidateSyncTags}
      />
    </>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`font-inter bg-white text-black`}>
      <NuqsAdapter>
        <section className="min-h-screen">
          <Alert />
          <Toaster />
          <Suspense fallback={null}>
            <DraftModeTools />
          </Suspense>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <Suspense fallback={null}>
            <Main>{children}</Main>
          </Suspense>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </section>
      </NuqsAdapter>
    </body>
  );
}
