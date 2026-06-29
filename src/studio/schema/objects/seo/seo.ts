import { defineField, defineType } from 'sanity';
import SEODescription from '@/studio/components/SEODescription';
import SEOTitle from '@/studio/components/SEOTitle';
import SocialImageInput from '@/studio/components/SocialImageInput';

// Card option fields are only relevant once the dynamic card is toggled on.
const staticOnly = ({ parent }: { parent?: { generateCard?: boolean } }) =>
  !parent?.generateCard;

export default defineType({
  title: 'SEO & Metadata',
  name: 'seoMetaFields',
  options: {
    collapsible: true,
  },
  type: 'object',
  fields: [
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      description:
        "If checked, this document won't be indexed by search engines and it won't render in the sitemap file",
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
      title: 'Meta / Social Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown in search results and social shares.',
    }),
    defineField({
      name: 'generateCard',
      title: 'Generate a dynamic social card',
      type: 'boolean',
      initialValue: false,
      description:
        'Overlay the page headline and your logo on the image, instead of sharing it as-is.',
      // Hosts the live card preview (renders below the toggle when on).
      components: { input: SocialImageInput },
    }),
    defineField({
      name: 'cardLayout',
      title: 'Card layout',
      type: 'string',
      initialValue: 'left',
      options: {
        layout: 'radio',
        list: [
          { title: 'Text on the left', value: 'left' },
          { title: 'Text on the right', value: 'right' },
        ],
      },
      hidden: staticOnly,
    }),
    defineField({
      name: 'cardHeadline',
      title: 'Card headline override',
      type: 'string',
      description: 'Optional. Defaults to the meta title, then the page title.',
      hidden: staticOnly,
    }),
    defineField({
      name: 'cardExcerpt',
      title: 'Card excerpt override',
      type: 'text',
      rows: 2,
      description:
        'Optional. Defaults to the meta description, then the page excerpt.',
      hidden: staticOnly,
    }),
    defineField({
      name: 'openGraph',
      title: 'Open Graph',
      type: 'openGraph',
    }),
  ],
});
