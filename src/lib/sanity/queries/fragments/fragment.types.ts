import type { GetPageQueryResult, PostQueryResult, PostsArchiveQueryResult } from '@/sanity.types';

export type PostCardFragmentType = NonNullable<PostsArchiveQueryResult['results'][number]>;
export type PostFragmentType = NonNullable<PostQueryResult>;
export type PersonFragmentType = NonNullable<PostFragmentType['author']>;
export type CategoryFragmentType = NonNullable<PostFragmentType['categories']>[number];

export type PageFragmentType = NonNullable<GetPageQueryResult>;
export type SeoFragmentType = NonNullable<PageFragmentType['seo']>;

export type SectionsType = PageFragmentType['pageSections'];
export type SectionType = NonNullable<SectionsType>[number];

export type CardGridSectionFragmentType = Extract<SectionType, { _type: 'cardGrid' }>;
export type CtaSectionFragmentType = Extract<SectionType, { _type: 'cta' }>;
export type DividerSectionFragmentType = Extract<SectionType, { _type: 'divider' }>;
export type HeroSectionFragmentType = Extract<SectionType, { _type: 'hero' }>;
export type MediaTextSectionFragmentType = Extract<SectionType, { _type: 'mediaText' }>;
export type PostListSectionFragmentType = Extract<SectionType, { _type: 'postList' }>;
export type SubscribeSectionFragmentType = Extract<SectionType, { _type: 'subscribe' }>;

export type ButtonFragmentType = NonNullable<HeroSectionFragmentType['buttons']>[number];
export type CardFragmentType = NonNullable<CardGridSectionFragmentType['cards']>[number];
export type LinkFragmentType = NonNullable<ButtonFragmentType['link']>;
