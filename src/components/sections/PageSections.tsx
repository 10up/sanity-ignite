'use client';

import { useOptimistic } from 'next-sanity/hooks';
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
  postList: () => <div>postlist</div>, // TODO: handle PostList
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
    initialSections ?? [],
    (currentSections, action) => {
      if (action.id !== documentId || !action?.document?.pageSections) {
        return currentSections;
      }

      return action.document.pageSections.map(
        (section) =>
          currentSections?.find((currentSection) => currentSection._key === section?._key) ||
          section,
      );
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

        if (!Component) {
          return (
            <div
              key={`${section._type}-${section._key}`}
              className="flex items-center justify-center p-8 my-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{section._type}</code>
            </div>
          );
        }

        return (
          <div
            key={section._key}
            data-sanity={dataAttr({
              id: documentId,
              type: documentType,
              path: `pageSections[_key=="${section._key}"]`,
            })}
          >
            {/* @ts-expect-error revisit this */}
            <Component section={section} />
          </div>
        );
      })}
    </main>
  );
}
