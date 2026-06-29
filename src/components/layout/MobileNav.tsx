'use client';

import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { z } from 'zod';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/shadcn/sheet';
import { getLinkByLinkObject } from '@/lib/links';
import type { settingsSchema } from '@/lib/sanity/queries/schemas';
import { cn } from '@/lib/utils';

type MenuItem = NonNullable<z.infer<typeof settingsSchema>['menu']>[number];

export const MobileNav = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();

  // Each link is wrapped in <SheetClose>, so tapping one dismisses the drawer.
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-9 items-center justify-center rounded-md text-paper lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-6" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-line-dark bg-ink text-paper sm:max-w-sm"
      >
        <SheetTitle className="px-5 pt-5 text-paper">Menu</SheetTitle>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-col px-5 text-base font-medium"
        >
          {items.map((item) => {
            const href = item.link
              ? getLinkByLinkObject(item.link) || '/'
              : '/';
            const isActive = pathname === href;
            return (
              <SheetClose asChild key={item._key}>
                <Link
                  href={href}
                  className={cn(
                    'border-line-dark border-b py-3.5',
                    isActive && 'text-purple'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  prefetch={false}
                  {...(item.link?.openInNewTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.text}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3 p-5">
          <Link
            href="https://github.com/10up/sanity-ignite"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line-dark px-4 py-2.5 font-semibold text-paper text-sm"
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
            className="inline-flex items-center justify-center gap-2 rounded-full border bg-gradient-to-tr from-primary via-violet-500 to-primary px-4 py-2.5 font-semibold text-primary-foreground text-sm"
          >
            <Image
              src="/fueled.png"
              alt="Fueled"
              width={280}
              height={53}
              className="h-[15px] w-auto"
            />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
