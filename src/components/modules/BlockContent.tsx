/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import Image from 'next/image';
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity';
import type { PropsWithChildren, ReactNode } from 'react';
import Link from '@/components/modules/Link';
import { urlForImage } from '@/lib/sanity/client/utils';
import type {
  LinkFragmentType,
  RelatedArticlesBlockType,
} from '@/lib/sanity/queries/schemas';
import { cn } from '@/lib/utils';
import { parseChildrenToSlug } from '@/utils/strings';
import { RelatedArticlesInline } from '../sections/RelatedArticlesInline';

type HeadingProps = PropsWithChildren<{
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id: string;
  className?: string;
}>;

function Heading({ as, id, children, className = '' }: HeadingProps) {
  const Element = as;
  return (
    <Element className={cn('relative group', className)}>
      {children}
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <title>Anchor</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </a>
    </Element>
  );
}

export default function BlockContent({
  className,
  value,
}: {
  className?: string;
  value: unknown[];
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="text leading-relaxed text-ink/90 mb-6">{children}</p>
      ),
      h1: ({ children, value }) => (
        <Heading
          as="h1"
          id={parseChildrenToSlug(value.children)}
          className="text-4xl md:text-5xl font-bold mb-8 text-ink scroll-mt-20"
        >
          {children}
        </Heading>
      ),
      h2: ({ children, value }) => (
        <Heading
          as="h2"
          id={parseChildrenToSlug(value.children)}
          className="text-3xl md:text-4xl font-bold mb-6 text-ink scroll-mt-20"
        >
          {children}
        </Heading>
      ),
      h3: ({ children, value }) => (
        <Heading
          as="h3"
          id={parseChildrenToSlug(value.children)}
          className="text-2xl md:text-3xl font-bold mb-4 text-ink scroll-mt-20"
        >
          {children}
        </Heading>
      ),
      h4: ({ children, value }) => (
        <Heading
          as="h4"
          id={parseChildrenToSlug(value.children)}
          className="text-xl md:text-2xl font-bold mb-4 text-ink scroll-mt-20"
        >
          {children}
        </Heading>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-gray-700">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-gray-700">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="pl-2">{children}</li>,
      number: ({ children }) => <li className="pl-2">{children}</li>,
    },
    marks: {
      code: ({ children }) => (
        <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">
          {children}
        </code>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({
        children,
        value,
      }: {
        children: ReactNode;
        value?: { customLink: LinkFragmentType };
      }) => {
        const customLink = value?.customLink;

        if (!customLink) {
          return <>{children}</>;
        }

        return (
          <Link
            link={customLink}
            className="text-primary hover:no-underline underline"
          >
            {children}
          </Link>
        );
      },
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      'strike-through': ({ children }) => (
        <del className="line-through">{children}</del>
      ),
      underline: ({ children }) => <u className="underline">{children}</u>,
      sup: ({ children }) => <sup className="text-xs">{children}</sup>,
      sub: ({ children }) => <sub className="text-xs">{children}</sub>,
    },
    types: {
      image: (props) => {
        const { value } = props;
        console.log({ value });
        if (!value || !value?.asset?._ref) {
          return null;
        }

        return (
          <div className="my-8 mx-auto lg:max-w-9/12 max-w-full">
            <Image
              width="1000"
              height="667"
              src={urlForImage(value)?.width(1000).height(667).url() as string}
              alt={value?.alt || 'Article image'}
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        );
      },
      blockQuote: ({ value }: { value: { quote?: string; cite?: string } }) => (
        <figure className="my-8 lg:max-w-9/12 max-w-11/12 mx-auto border-l-4 border-purple pl-4">
          <blockquote className="font-bold text-3xl leading-snug text-ink tracking-tight text-pretty">
            <p>&ldquo;{value.quote}&rdquo;</p>
          </blockquote>
          {value.cite && (
            <figcaption className="mt-3 font-mono text-xs text-muted-ink">
              —{' '}
              <cite className="font-mono not-italic uppercase tracking-widest">
                {value.cite}
              </cite>
            </figcaption>
          )}
        </figure>
      ),
      relatedArticles: ({ value }: { value: RelatedArticlesBlockType }) => (
        <RelatedArticlesInline articles={value.relatedArticles} />
      ),
    },
  };

  return (
    <div className={className}>
      <PortableText
        components={components}
        value={value as PortableTextBlock[]}
      />
    </div>
  );
}
