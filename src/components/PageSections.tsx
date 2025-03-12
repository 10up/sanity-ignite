'use client';

import { useOptimistic } from '@sanity/visual-editing/react';
import { Page } from '@/sanity.types';
import Hero from './sections/Hero';
import CTA from './sections/CTA';
import MediaText from './sections/MediaText';
// import PostList from './sections/PostList';
import CardGrid from './sections/CardGrid';
import Divider from './sections/Divider';
import Subscribe from './sections/Subscribe';
import { dataAttr } from '@/sanity/lib/utils';
import { type SanityDocument } from 'next-sanity';

const BLOCK_COMPONENTS = {
  hero: Hero,
  mediaText: MediaText,
  cta: CTA,
  subscribe: Subscribe,
  // postList: PostList, // TODO: handle PostLIst
  cardGrid: CardGrid,
  divider: Divider,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

type Section = NonNullable<NonNullable<Page['pageSections']>>[number];

type PageData = {
  _id: string;
  _type: string;
  pageSections?: Section[];
};

type PageSectionsProps = {
  documentId: string;
  documentType: string;
  sections?: Section[];
};

export default function PageSections({
  documentId,
  documentType,
  sections: initialSections = [],
}: PageSectionsProps) {
  const sections = useOptimistic<Section[], SanityDocument<PageData>>(
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
        const Component = BLOCK_COMPONENTS[section._type as BlockType];

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
            {/* TODO: fix types */}
            <Component section={section} />
          </div>
        );
      })}
    </main>
  );
}
