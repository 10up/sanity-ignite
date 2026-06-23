'use client';

import type { SanityDocument } from 'next-sanity';
import { useOptimistic } from 'next-sanity/hooks';
import type { ComponentType } from 'react';
import { dataAttr } from '@/lib/sanity/client/utils';
import type {
  ArticleListSectionFragmentType,
  HeroSectionFragmentType,
  MediaTextSectionFragmentType,
  SectionsType,
  SectionType,
} from '@/lib/sanity/queries/schemas';
import ArticleList from './ArticleList';
import { Hero } from './HomeHero';
import MediaText from './MediaText';

type SectionComponentMap = {
  hero: ComponentType<{ section: HeroSectionFragmentType }>;
  mediaText: ComponentType<{ section: MediaTextSectionFragmentType }>;
  articleList: ComponentType<{ section: ArticleListSectionFragmentType }>;
};

const SECTION_COMPONENTS: SectionComponentMap = {
  hero: Hero,
  mediaText: MediaText,
  articleList: ArticleList,
} as const;

type PageSectionsProps = {
  documentId: string;
  documentType: string;
  sections?: SectionsType;
};

// The Sanity document shape that useOptimistic receives from the Presentation tool.
type PageData = SanityDocument<{
  pageSections?: SectionsType;
}>;

// Action shape emitted by next-sanity's useOptimistic when an editor mutates a document.
type SanityOptimisticAction = { id: string; document?: PageData };

/**
 * Applies an optimistic update from Sanity's Presentation tool to the sections array.
 *
 * When an editor changes content in Sanity Studio, Sanity emits a document mutation
 * event via SSE before the server re-renders. This reducer applies those changes
 * immediately to the client-side state so the preview feels instant.
 *
 * Strategy: for each section in the incoming document, keep the already-rendered
 * version if it exists (prevents flicker), or use the new data for newly added sections.
 *
 * This optimistic state is temporary — SanityLive triggers router.refresh() shortly
 * after, which replaces it with the authoritative server-rendered data.
 */
function applyOptimisticSectionUpdate(
  documentId: string,
  currentSections: SectionsType,
  action: SanityOptimisticAction
): SectionsType {
  if (action.id !== documentId || !action.document?.pageSections) {
    return currentSections;
  }

  return action.document.pageSections.map(
    (incomingSection) =>
      currentSections?.find((s) => s._key === incomingSection._key) ??
      incomingSection
  );
}

export default function PageSections({
  documentId,
  documentType,
  sections: initialSections = [],
}: PageSectionsProps) {
  const sections = useOptimistic<SectionsType, PageData>(
    initialSections ?? [],
    (current, action) =>
      applyOptimisticSectionUpdate(documentId, current, action)
  );

  if (!sections?.length) {
    return null;
  }

  return (
    <div
      data-sanity={dataAttr({
        id: documentId,
        type: documentType,
        path: 'pageSections',
      })}
    >
      {sections?.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[
          section._type as keyof SectionComponentMap
        ] as ComponentType<{ section: SectionType }> | undefined;

        if (!SectionComponent) {
          return (
            <div
              key={section._key}
              className="flex items-center justify-center p-8 my-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{section._type}</code>
            </div>
          );
        }

        return (
          <div
            key={section._key}
            data-section-type={section._type}
            data-sanity={dataAttr({
              id: documentId,
              type: documentType,
              path: `pageSections[_key=="${section._key}"]`,
            })}
          >
            <SectionComponent section={section} />
          </div>
        );
      })}
    </div>
  );
}
