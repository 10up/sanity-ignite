import { GetPageQueryResult, PostQueryResult, PostsArchiveQueryResult } from '@/sanity.types';

export type PostCardFragmentType = NonNullable<PostsArchiveQueryResult['results'][number]>;
export type PostFragmentType = NonNullable<PostQueryResult>;
export type PersonFragmentType = NonNullable<PostFragmentType['author']>;
export type CategoryFragmentType = NonNullable<PostFragmentType['categories']>[number];

export type PageFragmentType = NonNullable<GetPageQueryResult>;
export type SeoFragmentType = NonNullable<PageFragmentType['seo']>;
export type SectionsType = NonNullable<PageFragmentType['pageSections']>[number];

export type CardGridsSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'cardGrid' }
>;
export type CtaSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'cta' }>;
export type DividerSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'divider' }>;
export type HeroSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'hero' }>;
export type MediaTextSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'mediaText' }
>;
export type PostListSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'postList' }>;
export type SubscribeSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'subscribe' }
>;

export type ButtonFragmentType = NonNullable<HeroSectionFragmentType['buttons']>[number];
export type LinkFragmentType = NonNullable<ButtonFragmentType['link']>;
