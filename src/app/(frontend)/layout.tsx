import '../globals.css';

import { draftMode } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { SanityLive } from '@/lib/sanity/client/live';
import { handleError } from './client-utils';

const DraftModeToast = dynamic(() => import('@/components/modules/DraftModeToast'));
const Toaster = dynamic(() => import('sonner').then((mod) => mod.Toaster));
const VisualEditing = dynamic(() => import('next-sanity').then((mod) => mod.VisualEditing));

import dynamic from 'next/dynamic';
import Alert from '@/components/layout/Alert';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <body className={`font-inter bg-white text-black`}>
      <section className="min-h-screen">
        <Alert />
        {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
            <VisualEditing />
          </>
        )}
        {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
        <SanityLive onError={handleError} />
        <Header />
        <Main>{children}</Main>
        <Footer />
      </section>
    </body>
  );
}
