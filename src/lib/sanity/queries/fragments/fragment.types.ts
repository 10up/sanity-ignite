import type { z } from 'zod';
import type {
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
  postCardSchema,
  postListSectionSchema,
  postSchema,
  sectionSchema,
  seoSchema,
  subscribeSectionSchema,
} from '../schemas';

export type PostCardFragmentType = z.infer<typeof postCardSchema>;
export type PostFragmentType = z.infer<typeof postSchema>;
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
export type PostListSectionFragmentType = z.infer<typeof postListSectionSchema>;
export type SubscribeSectionFragmentType = z.infer<
  typeof subscribeSectionSchema
>;

export type ButtonFragmentType = z.infer<typeof buttonSchema>;
export type CardFragmentType = z.infer<typeof cardSchema>;
export type LinkFragmentType = z.infer<typeof linkSchema>;
