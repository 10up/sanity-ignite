import { GetPageQueryResult } from '@/sanity.types';

export type Sections = NonNullable<GetPageQueryResult>['pageSections'];

export type Section = NonNullable<Sections>[number];

export type HeroSection = Extract<Section, { _type: 'hero' }>;
export type MediaTextSection = Extract<Section, { _type: 'mediaText' }>;
export type CtaSection = Extract<Section, { _type: 'cta' }>;
export type SubscribeSection = Extract<Section, { _type: 'subscribe' }>;
export type PostListSection = Extract<Section, { _type: 'postList' }>;
export type CardGridSection = Extract<Section, { _type: 'cardGrid' }>;
export type DividerSection = Extract<Section, { _type: 'divider' }>;
