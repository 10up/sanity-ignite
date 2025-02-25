import { defineField, defineType } from 'sanity';
import SEOTitleFeedback from '@/sanity/components/SEOTitleFeedback';
import SEODescriptionFeedback from '@/sanity/components/SEODescriptionFeedback';

export default defineType({
  title: 'Seo MetaFields',
  name: 'seoMetaFields',
  type: 'object',
  fields: [
    defineField({
      name: 'nofollowAttributes',
      title: 'Index',
      type: 'boolean',
      initialValue: false,
      description:
        "To prevent a URL from being indexed, you'll also need to select the true index on the tag.",
    }),
    defineField({
      name: 'metaTitle',
      title: 'Title',
      type: 'string',
      components: {
        input: SEOTitleFeedback,
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      components: {
        input: SEODescriptionFeedback,
      },
    }),
    defineField({
      name: 'metaImage',
      title: 'Meta Image',
      type: 'image',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'openGraph',
      title: 'Open Graph',
      type: 'openGraph',
    }),
    defineField({
      name: 'additionalMetaTags',
      title: 'Additional Meta Tags',
      type: 'array',
      of: [{ type: 'metaTag' }],
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter',
      type: 'twitter',
    }),
  ],
});
