import Image from 'next/image';
import Link from 'next/link';
import type { CacheProfile } from '@/lib/sanity/client/fetch';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import { settingsSchema } from '@/lib/sanity/queries/schemas';
import { SiteSearch } from '../modules/SiteSearch';
import { NavLinks } from './NavLinks';

export const Header = async () => {
  const settings = await sanityFetch({
    query: settingsQuery,
    schema: settingsSchema,
    cache: { profile: 'max' as CacheProfile, tags: ['sanity:type:settings'] },
    bypassLiveFetch: true,
  });

  if (!settings) {
    return null;
  }

  return (
    <header className="relative flex items-center justify-between overflow-hidden border-line-dark border-b bg-ink px-7 py-3.5 text-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-paper focus:px-4 focus:py-2 focus:rounded focus:text-ink"
      >
        Skip to main content
      </a>
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-8 mx-auto max-w-7xl">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-extrabold text-lg tracking-tight"
        >
          <span className="mr-0 inline-block text-sm" aria-hidden="true">
            🔥
          </span>
          Ignite for Sanity{' '}
          <span className="text-xs text-paper font-semibold border border-purple inline-flex items-center justify-center rounded-sm leading-none size-6 bg-purple/30">
            v2
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 font-medium text-sm"
        >
          <NavLinks items={settings.menu ?? []} />
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="https://github.com/10up/sanity-ignite"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="inline-flex gap-2 rounded-full bg-none px-4 py-2 font-semibold text-primary-foreground text-sm h-[32px] items-center"
          >
            <svg
              className="size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </Link>
          <Link
            href="https://fueled.com"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            aria-label="Visit Fueled website, opens in new tab"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-primary-foreground text-xs h-[32px] bg-gradient-to-tr from-primary via-violet-500 to-primary border"
          >
            <Image
              src="/fueled.png"
              alt=""
              width={280}
              height={53}
              className="w-auto h-[15px] transform translate-y-[-1px]"
            />
          </Link>
          <SiteSearch searchPlaceholder="Search..." />
        </div>
      </div>
    </header>
  );
};
