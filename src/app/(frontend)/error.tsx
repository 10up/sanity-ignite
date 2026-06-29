'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { PageHero } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/shadcn/button';

export default function ErrorBoundary({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Replace with your error reporting service (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <main id="main" aria-label="Something went wrong">
      <PageHero
        title="Something went wrong"
        excerpt="An unexpected error occurred. You can try again, or head back home."
      />
      <div className="mx-auto flex max-w-4xl items-center gap-3 py-10">
        <Button asChild size="lg">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
