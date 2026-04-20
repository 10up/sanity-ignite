import '../globals.css';

import dynamic from 'next/dynamic';
import { draftMode } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next';
import Alert from '@/components/layout/Alert';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { SanityLive } from '@/lib/sanity/client/live';
import { handleError } from './client-utils';

const DraftModeToast = dynamic(
  () => import('@/components/modules/DraftModeToast')
);
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster));
const VisualEditing = dynamic(() =>
  import('next-sanity/visual-editing').then((mod) => mod.VisualEditing)
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <body className={`font-inter bg-white text-black`}>
      <NuqsAdapter>
        <section className="min-h-screen">
          <Alert />
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              <VisualEditing />
            </>
          )}
          {isDraftMode && <SanityLive onError={handleError} />}
          <Header />
          <Main>{children}</Main>
          <Footer />
        </section>
      </NuqsAdapter>
    </body>
  );
}
