import { z } from 'zod';

const linkSchema = z
  .object({
    _type: z.string(),
    type: z.string().nullish(),
    openInNewTab: z.boolean().nullish(),
    external: z.string().nullish(),
    href: z.string().nullish(),
    internal: z
      .object({
        _type: z.string(),
        _id: z.string(),
        slug: z.string().nullish(),
      })
      .nullish(),
  })
  .passthrough();

const _buttonSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
    variant: z.string().nullish(),
    text: z.string().nullish(),
    link: linkSchema.nullish(),
  })
  .passthrough();

const sectionSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
  })
  .passthrough();

const seoSchema = z
  .object({
    _type: z.string(),
    metaTitle: z.string().nullish(),
    noIndex: z.boolean().nullish(),
    seoKeywords: z.string().nullish(),
    metaDescription: z.string().nullish(),
  })
  .passthrough();

const pageSchema = z
  .object({
    pageSections: z.array(sectionSchema).nullish(),
    seo: seoSchema.nullish(),
  })
  .passthrough();

export const homePageSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('homePage'),
    name: z.string().nullish(),
  })
  .merge(pageSchema);

const menuItemSchema = z
  .object({
    _type: z.string(),
    _key: z.string(),
    text: z.string().nullish(),
    type: z.string().nullish(),
    link: linkSchema.nullish(),
    childMenu: z
      .array(z.object({ _type: z.string(), _key: z.string() }).passthrough())
      .nullish(),
  })
  .passthrough();

export const settingsSchema = z
  .object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    menu: z.array(menuItemSchema).nullish(),
  })
  .passthrough();
