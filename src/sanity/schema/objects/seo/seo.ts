import { defineField, defineType } from 'sanity';
import SEOTitle from '@/sanity/components/SEOTitle';
import SEODescription from '@/sanity/components/SEODescription';

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
        input: SEOTitle,
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
      components: {
        input: SEODescription,
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
