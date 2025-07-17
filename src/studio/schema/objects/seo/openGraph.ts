import { defineField } from 'sanity';
import SEODescription from '@/studio/components/SEODescription';
import SEOTitle from '@/studio/components/SEOTitle';

export default defineField({
  name: 'openGraph',
  title: 'Open Graph',
  type: 'object',
  description:
    'Control how your content appears when shared on social media platforms (e.g., Facebook, LinkedIn) or in messaging apps (e.g., Slack, WhatsApp).',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      components: {
        input: SEOTitle,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      components: {
        input: SEODescription,
      },
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
  ],
});
