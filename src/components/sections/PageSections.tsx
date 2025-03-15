'use client';

import { useOptimistic } from '@sanity/visual-editing/react';
import { type SanityDocument } from 'next-sanity';
import { dataAttr } from '@/lib/sanity/client/utils';
import { Sections } from './types';
import Hero from './Hero';
import CTA from './CTA';
import MediaText from './MediaText';
// import PostList from './PostList';
import CardGrid from './CardGrid';
import Divider from './Divider';
import Subscribe from './Subscribe';

const BLOCK_COMPONENTS = {
  hero: Hero,
  mediaText: MediaText,
  cta: CTA,
  subscribe: Subscribe,
  postList: () => <></>, // TODO: handle PostList
  cardGrid: CardGrid,
  divider: Divider,
} as const;

type PageSectionsProps = {
  documentId: string;
  documentType: string;
  sections?: Sections;
};

type PageData = {
  _id: string;
  _type: string;
  pageSections?: Sections;
};

export default function PageSections({
  documentId,
  documentType,
  sections: initialSections = [],
}: PageSectionsProps) {
  const sections = useOptimistic<Sections, SanityDocument<PageData>>(
    initialSections,
    (currentSections, action) => {
      if (action.id === documentId && action.document.pageSections) {
        return action.document.pageSections;
      }

      return currentSections;
    },
  );

  if (!sections?.length) {
    return null;
  }

  return (
    <main
      className="max-w-7xl mx-auto"
      data-sanity={dataAttr({
        id: documentId,
        type: documentType,
        path: 'pageSections',
      })}
    >
      {sections?.map((section) => {
        const Component = BLOCK_COMPONENTS[section._type];

        if (!Component) return null;

        return (
          <div
            key={section._key}
            data-sanity={dataAttr({
              id: documentId,
              type: documentType,
              path: `pageSections[_key=="${section._key}"]`,
            })}
          >
            {/* @ts-expect-error need to revisit this once we figure out the image types */}
            <Component section={section} />
          </div>
        );
      })}
    </main>
  );
}
