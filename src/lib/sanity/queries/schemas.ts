import { z } from 'zod';

// ─── Primitives ──────────────────────────────────────────────────────────────

const imageSchema = z
  .object({
    asset: z
      .object({
        _ref: z.string(),
        _type: z.literal('reference'),
      })
      .loose()
      .optional(),
    hotspot: z
      .object({
        _type: z.string(),
        x: z.number().nullish(),
        y: z.number().nullish(),
        height: z.number().nullish(),
        width: z.number().nullish(),
      })
      .loose()
      .nullish(),
    crop: z
      .object({
        _type: z.string(),
        right: z.number().nullish(),
        top: z.number().nullish(),
        left: z.number().nullish(),
        bottom: z.number().nullish(),
      })
      .loose()
      .nullish(),
    alt: z.string().nullish(),
    _type: z.literal('image'),
  })
  .loose();

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
        slug: z.string().nullable(),
      })
      .nullish(),
  })
  .loose();

const buttonVariantSchema = z
  .enum([
    'default',
    'secondary',
    'outline',
    'link',
    'destructive',
    'ghost',
    'gradient',
  ])
  .nullish();

const buttonSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
    variant: buttonVariantSchema,
    text: z.string().nullish(),
    link: linkSchema.nullish(),
  })
  .loose();

const blockContentSchema = z.array(
  z
    .object({
      _type: z.string(),
      _key: z.string().optional(),
      children: z
        .array(
          z
            .object({
              _type: z.string(),
              _key: z.string(),
              text: z.string().optional(),
            })
            .loose()
        )
        .optional(),
    })
    .loose()
);

const openGraphSchema = z
  .object({
    _type: z.string(),
    title: z.string().nullish(),
    description: z.string().nullish(),
    siteName: z.string().nullish(),
    url: z.string().nullish(),
    image: imageSchema.nullish(),
  })
  .loose();

const twitterSchema = z
  .object({
    _type: z.string(),
    site: z.string().nullish(),
    creator: z.string().nullish(),
    cardType: z.string().nullish(),
    handle: z.string().nullish(),
  })
  .loose();

const metaAttributeSchema = z
  .object({
    _type: z.string(),
    attributeKey: z.string().nullish(),
    attributeType: z.string().nullish(),
    attributeValueString: z.string().nullish(),
    attributeValueImage: imageSchema.nullish(),
  })
  .loose();

const metaTagSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
    metaAttributes: z.array(metaAttributeSchema).nullish(),
  })
  .loose();

const seoSchema = z
  .object({
    _type: z.string(),
    metaTitle: z.string().nullish(),
    noIndex: z.boolean().nullish(),
    seoKeywords: z.union([z.string(), z.array(z.string())]).nullish(),
    metaDescription: z.string().nullish(),
    metaImage: imageSchema.nullish(),
    openGraph: openGraphSchema.nullish(),
    twitter: twitterSchema.nullish(),
    additionalMetaTags: z.array(metaTagSchema).nullish(),
  })
  .loose();

const cardSchema = z
  .object({
    heading: z.string().nullish(),
    content: blockContentSchema.nullish(),
    _type: z.string(),
  })
  .loose();

// ─── Document fragments ──────────────────────────────────────────────────────

const categorySchema = z
  .object({
    _id: z.string(),
    _type: z.literal('category'),
    title: z.string().nullish(),
    slug: z.string().nullable(),
    description: z.string().nullish(),
  })
  .loose();

const personSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('person'),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    slug: z.string().nullable(),
    role: z.string().nullish(),
    image: imageSchema.nullish(),
  })
  .loose();

const postCardSchema = z
  .object({
    _type: z.literal('post'),
    _id: z.string(),
    status: z.string().nullish(),
    title: z.string(),
    slug: z.string().nullable(),
    excerpt: z.string().nullish(),
    date: z.string().nullish(),
    wordCount: z.number().nullish(),
    image: imageSchema.nullish(),
    categories: z.array(categorySchema).nullish(),
    author: personSchema.nullish(),
  })
  .loose();

// ─── Page sections ───────────────────────────────────────────────────────────

const sectionBaseSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
  })
  .loose();

const heroSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('hero'),
  heading: z.string().nullish(),
  text: blockContentSchema.nullish(),
  image: imageSchema.nullish(),
  buttons: z.array(buttonSchema).nullish(),
});

const mediaTextSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('mediaText'),
  heading: z.string().nullish(),
  content: blockContentSchema.nullish(),
  imagePosition: z.string().nullish(),
  image: imageSchema.nullish(),
  buttons: z.array(buttonSchema).nullish(),
});

const ctaSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('cta'),
  heading: z.string().nullish(),
  text: z.string().nullish(),
  buttons: z.array(buttonSchema).nullish(),
});

const cardGridSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('cardGrid'),
  heading: z.string().nullish(),
  content: blockContentSchema.nullish(),
  cards: z.array(cardSchema).nullish(),
});

const dividerSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('divider'),
  height: z.number().nullish(),
});

const subscribeSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('subscribe'),
  heading: z.string().nullish(),
  content: blockContentSchema.nullish(),
  buttonText: z.string().nullish(),
});

const postListSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('postList'),
  heading: z.string().nullish(),
  numberOfPosts: z.number().nullish(),
  posts: z.array(postCardSchema),
});

const sectionSchema = z.discriminatedUnion('_type', [
  heroSectionSchema,
  mediaTextSectionSchema,
  ctaSectionSchema,
  cardGridSectionSchema,
  dividerSectionSchema,
  subscribeSectionSchema,
  postListSectionSchema,
]);

// ─── Page schemas ────────────────────────────────────────────────────────────

const pageSchema = z
  .object({
    pageSections: z.array(sectionSchema).nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();

export const homePageSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('homePage'),
    name: z.string().nullish(),
  })
  .merge(pageSchema);

export const blogPageSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('blogPage'),
    name: z.string().nullish(),
  })
  .merge(pageSchema);

export const pageSchema_ = z
  .object({
    _id: z.string(),
    _type: z.literal('page'),
    name: z.string().nullish(),
    slug: z.object({ current: z.string() }).nullish(),
  })
  .merge(pageSchema);

export const allCategoriesSchema = z.array(categorySchema);

export const postSchema = postCardSchema
  .extend({
    content: blockContentSchema.nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();

export const postsArchiveSchema = z.object({
  total: z.number(),
  results: z.array(postCardSchema),
});

export const sitemapSchema = z.array(
  z.object({
    href: z.string().nullish(),
    _updatedAt: z.string(),
  })
);

// ─── Settings ────────────────────────────────────────────────────────────────

const menuItemBaseSchema = z
  .object({
    _type: z.string(),
    _key: z.string(),
    text: z.string().nullish(),
    type: z.string().nullish(),
    link: linkSchema.nullish(),
  })
  .loose();

const menuItemSchema = menuItemBaseSchema.extend({
  childMenu: z.array(menuItemBaseSchema).nullish(),
});

export const settingsSchema = z
  .object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    menu: z.array(menuItemSchema).nullish(),
  })
  .loose();

// ─── Re-exports for type inference ───────────────────────────────────────────

export {
  categorySchema,
  linkSchema,
  buttonSchema,
  imageSchema,
  seoSchema,
  personSchema,
  postCardSchema,
  heroSectionSchema,
  mediaTextSectionSchema,
  ctaSectionSchema,
  cardGridSectionSchema,
  dividerSectionSchema,
  subscribeSectionSchema,
  postListSectionSchema,
  cardSchema,
  sectionSchema,
};
