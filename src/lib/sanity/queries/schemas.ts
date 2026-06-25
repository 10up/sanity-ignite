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
export type ImageFragmentType = z.infer<typeof imageSchema>;

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
export type LinkFragmentType = z.infer<typeof linkSchema>;

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
export type ButtonFragmentType = z.infer<typeof buttonSchema>;

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
export type SeoFragmentType = z.infer<typeof seoSchema>;

// ─── Document fragments ──────────────────────────────────────────────────────

const categorySchema = z
  .object({
    _id: z.string(),
    _type: z.literal('category'),
    title: z.string().nullish(),
    slug: z.string().nullish(),
    description: z.string().nullish(),
    children: z
      .array(
        z.object({
          title: z.string().nullish(),
          slug: z.string().nullish(),
        })
      )
      .nullish(),
    parent: z
      .object({
        _ref: z.string(),
        _type: z.literal('reference'),
      })
      .nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();
export type CategoryFragmentType = z.infer<typeof categorySchema>;

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
export type PersonFragmentType = z.infer<typeof personSchema>;

const articleCardSchema = z
  .object({
    _type: z.literal('article'),
    _id: z.string(),
    status: z.string().nullish(),
    title: z.string(),
    slug: z.string().nullable(),
    excerpt: z.string().nullish(),
    date: z.string().nullish(),
    image: imageSchema.nullish(),
    categories: z.array(categorySchema).nullish(),
    author: personSchema.nullish(),
    readTime: z.number().nullish(),
    countryInterest: z.array(z.string()).nullish(),
  })
  .loose();
export type ArticleCardFragmentType = z.infer<typeof articleCardSchema>;

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
      relatedArticles: z.array(articleCardSchema).optional(),
    })
    .loose()
);

// ─── Page sections ───────────────────────────────────────────────────────────

const sectionBaseSchema = z
  .object({
    _key: z.string(),
    _type: z.string(),
  })
  .loose();

const heroSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('hero'),
  kicker: z.string().nullish(),
  heading: z.string().nullish(),
  tagline: z.string().nullish(),
  image: imageSchema.nullish(),
  article: articleCardSchema.nullish(),
});
export type HeroSectionFragmentType = z.infer<typeof heroSectionSchema>;

const mediaTextSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('mediaText'),
  heading: z.string().nullish(),
  subtitle: z.string().nullish(),
  content: blockContentSchema.nullish(),
  imagePosition: z.string().nullish(),
  image: imageSchema.nullish(),
});
export type MediaTextSectionFragmentType = z.infer<
  typeof mediaTextSectionSchema
>;

const articleListSectionSchema = sectionBaseSchema.extend({
  _type: z.literal('articleList'),
  heading: z.string().nullish(),
  layout: z.string().nullish(),
  articles: z.array(articleCardSchema),
});
export type ArticleListSectionFragmentType = z.infer<
  typeof articleListSectionSchema
>;

const sectionSchema = z.discriminatedUnion('_type', [
  heroSectionSchema,
  mediaTextSectionSchema,
  articleListSectionSchema,
]);
export type SectionType = z.infer<typeof sectionSchema>;
export type SectionsType = SectionType[] | null | undefined;

// ─── Page schemas ────────────────────────────────────────────────────────────

const pageSchemaBase = z
  .object({
    pageSections: z.array(sectionSchema).nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();

export const homePageSchema = z.object({
  ...pageSchemaBase.shape,
  _id: z.string(),
  _type: z.literal('homePage'),
  name: z.string().nullish(),
});

export const articleArchivePageSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('articleArchivePage'),
    name: z.string().nullish(),
    featuredArticle: articleCardSchema.nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();

export const pageSchema = z
  .object({
    _id: z.string(),
    _type: z.literal('page'),
    name: z.string().nullish(),
    slug: z.object({ current: z.string() }).nullish(),
    excerpt: z.string().nullish(),
    content: blockContentSchema.nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();

export const pageSlugsSchema = z.array(z.string());

export const allCategoriesSchema = z.array(categorySchema);

export const articleSchema = articleCardSchema
  .extend({
    content: blockContentSchema.nullish(),
    seo: seoSchema.nullish(),
  })
  .loose();
export type ArticleFragmentType = z.infer<typeof articleSchema>;

export const relatedArticlesBlockSchema = z.object({
  _key: z.string(),
  _type: z.literal('relatedArticles'),
  category: z
    .object({
      _ref: z.string(),
      _type: z.literal('reference'),
    })
    .nullish(),
  relatedArticles: z.array(articleCardSchema),
});
export type RelatedArticlesBlockType = z.infer<
  typeof relatedArticlesBlockSchema
>;

export const articlesArchiveSchema = z.array(articleCardSchema).nullish();

// ─── Search ──────────────────────────────────────────────────────────────────

export const searchResultSchema = z.object({
  _id: z.string(),
  _score: z.number(),
  title: z.string(),
  slug: z.string().nullable(),
  summary: z.string().nullish(),
});
export type SearchResultType = z.infer<typeof searchResultSchema>;

export const searchResultsSchema = z.array(searchResultSchema);

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
export type SettingsType = z.infer<typeof settingsSchema>;

// ─── Agent readiness: feeds & llms.txt ───────────────────────────────────────

export const navPagesSchema = z.array(
  z.object({
    title: z.string().nullish(),
    slug: z.string().nullish(),
  })
);

// ─── Re-exports for type inference ───────────────────────────────────────────

export {
  categorySchema,
  linkSchema,
  buttonSchema,
  imageSchema,
  seoSchema,
  personSchema,
  articleCardSchema,
  heroSectionSchema,
  mediaTextSectionSchema,
  articleListSectionSchema,
  sectionSchema,
};
