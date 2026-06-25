import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/shadcn/button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main" aria-label="Page not found">
      <PageHero
        title="404 — Page not found"
        excerpt="The page you're looking for doesn't exist or may have been moved."
      />
      <div className="mx-auto max-w-4xl py-10">
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
