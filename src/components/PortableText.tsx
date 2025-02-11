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

type HeadingProps = PropsWithChildren<{
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  key: string | undefined;
}>;

function Heading({ as, children, key }: HeadingProps) {
  const Element = as;
  return (
    <Element className="group relative">
      {children}
      <a
        href={`#${key}`}
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
      h1: ({ children, value }) => (
        <Heading as="h1" key={value?._key}>
          {children}
        </Heading>
      ),
      h2: ({ children, value }) => {
        return (
          <Heading as="h2" key={value?._key}>
            {children}
          </Heading>
        );
      },
      h3: ({ children, value }) => {
        return (
          <Heading as="h3" key={value?._key}>
            {children}
          </Heading>
        );
      },
      h4: ({ children, value }) => {
        return (
          <Heading as="h4" key={value?._key}>
            {children}
          </Heading>
        );
      },
      h5: ({ children, value }) => {
        return (
          <Heading as="h5" key={value?._key}>
            {children}
          </Heading>
        );
      },
      h6: ({ children, value }) => {
        return (
          <Heading as="h6" key={value?._key}>
            {children}
          </Heading>
        );
      },
      normal: ({ children }) => <p>{children}</p>,
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
      // TODO: handle page/post links
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
