import type { z } from 'zod';
import type {
  articleCardSchema,
  articleListSectionSchema,
  articleSchema,
  buttonSchema,
  cardGridSectionSchema,
  cardSchema,
  categorySchema,
  ctaSectionSchema,
  dividerSectionSchema,
  heroSectionSchema,
  linkSchema,
  mediaTextSectionSchema,
  personSchema,
  sectionSchema,
  seoSchema,
  subscribeSectionSchema,
} from '../schemas';

export type ArticleCardFragmentType = z.infer<typeof articleCardSchema>;
export type ArticleFragmentType = z.infer<typeof articleSchema>;
export type PersonFragmentType = z.infer<typeof personSchema>;
export type CategoryFragmentType = z.infer<typeof categorySchema>;

export type SeoFragmentType = z.infer<typeof seoSchema>;

export type SectionType = z.infer<typeof sectionSchema>;
export type SectionsType = SectionType[] | null | undefined;

export type CardGridSectionFragmentType = z.infer<typeof cardGridSectionSchema>;
export type CtaSectionFragmentType = z.infer<typeof ctaSectionSchema>;
export type DividerSectionFragmentType = z.infer<typeof dividerSectionSchema>;
export type HeroSectionFragmentType = z.infer<typeof heroSectionSchema>;
export type MediaTextSectionFragmentType = z.infer<
  typeof mediaTextSectionSchema
>;
export type ArticleListSectionFragmentType = z.infer<
  typeof articleListSectionSchema
>;
export type SubscribeSectionFragmentType = z.infer<
  typeof subscribeSectionSchema
>;

export type ButtonFragmentType = z.infer<typeof buttonSchema>;
export type CardFragmentType = z.infer<typeof cardSchema>;
export type LinkFragmentType = z.infer<typeof linkSchema>;
