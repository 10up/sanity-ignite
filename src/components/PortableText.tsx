/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity';

import ResolvedLink from '@/components/ResolvedLink';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/utils';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { parseChildrenToSlug } from '@/utils/string';

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
        className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
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

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="text-xl mb-4">{children}</p>,
      h1: ({ children, value }) => (
        <Heading
          as="h1"
          id={parseChildrenToSlug(value.children)}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          {children}
        </Heading>
      ),
      h2: ({ children, value }) => (
        <Heading
          as="h2"
          id={parseChildrenToSlug(value.children)}
          className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5"
        >
          {children}
        </Heading>
      ),
      h3: ({ children, value }) => (
        <Heading
          as="h3"
          id={parseChildrenToSlug(value.children)}
          className="text-3xl font-bold mb-3"
        >
          {children}
        </Heading>
      ),
      h4: ({ children, value }) => (
        <Heading as="h4" id={parseChildrenToSlug(value.children)} className="">
          {children}
        </Heading>
      ),
      h5: ({ children, value }) => (
        <Heading as="h5" id={parseChildrenToSlug(value.children)} className="">
          {children}
        </Heading>
      ),
      h6: ({ children, value }) => (
        <Heading as="h6" id={parseChildrenToSlug(value.children)} className="">
          {children}
        </Heading>
      ),
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      code: ({ children }) => <code>{children}</code>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value: link }) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>;
      },
      strong: ({ children }) => <strong>{children}</strong>,
      'strike-through': ({ children }) => <del>{children}</del>,
      underline: ({ children }) => <u>{children}</u>,
      sup: ({ children }) => <sup>{children}</sup>,
      sub: ({ children }) => <sub>{children}</sub>,
    },
    types: {
      image: (props) => {
        const { value } = props;
        if (!value) {
          return null;
        }

        return (
          <Image
            width="1000"
            height="667"
            src={urlForImage(value)?.width(1000).height(667).url() as string}
            alt={value?.alt || ''}
          />
        );
      },
    },
  };

  return (
    <div className={['prose', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  );
}
