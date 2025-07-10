import NextLink from 'next/link';
import { getLinkByLinkObject } from '@/lib/links';
import type { LinkFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

interface LinkProps {
  link: LinkFragmentType;
  children: React.ReactNode;
  className?: string;
}

export default function Link({ link, children, className }: LinkProps) {
  const url = getLinkByLinkObject(link);

  if (url) {
    return (
      <NextLink
        href={url}
        target={link.openInNewTab ? '_blank' : undefined}
        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </NextLink>
    );
  }
  return <>{children}</>;
}
