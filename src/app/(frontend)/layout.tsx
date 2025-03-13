import '../globals.css';

import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import { Toaster } from 'sonner';

import DraftModeToast from '@/components/DraftModeToast';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { SanityLive } from '@/sanity/lib/live';
import { handleError } from './client-utils';
import Main from '@/components/layout/Main';
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <body className={`${inter.variable} bg-white text-black`}>
      <section className="min-h-screen">
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
