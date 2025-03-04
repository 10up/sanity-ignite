import NextLink from 'next/link';

import { CustomUrl } from '@/sanity.types';

interface LinkProps {
  url: CustomUrl;
  children: React.ReactNode;
  className?: string;
}

export default function Link({ url, children, className }: LinkProps) {
  // resolveLink() is used to determine the type of link and return the appropriate URL.

  if (typeof url.href === 'string') {
    return (
      <NextLink
        href={url.href}
        target={url.openInNewTab ? '_blank' : undefined}
        rel={url.openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </NextLink>
    );
  }
  return <>{children}</>;
}
