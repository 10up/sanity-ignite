'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLinkByLinkObject } from '@/lib/links';
import { settingsSchema } from '@/lib/sanity/queries/schemas';
import { cn } from '@/lib/utils';
import type { z } from 'zod';

type MenuItem = NonNullable<z.infer<typeof settingsSchema>['menu']>[number];

export const NavLinks = ({ items }: { items: MenuItem[] }) => {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const href = item.link ? getLinkByLinkObject(item.link) || '/' : '/';
        const isActive = pathname === href;
        return (
          <Link
            key={item._key}
            href={href}
            className={cn('border-b border-white', isActive && 'border-primary')}
            aria-current={isActive ? 'page' : undefined}
            prefetch={false}
          >
            {item.text}
          </Link>
        );
      })}
    </>
  );
};
