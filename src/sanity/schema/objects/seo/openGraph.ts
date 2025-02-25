import SEODescriptionFeedback from '@/sanity/components/SEODescriptionFeedback';
import SEOTitleFeedback from '@/sanity/components/SEOTitleFeedback';
import { defineField } from 'sanity';

export default defineField({
  name: 'openGraph',
  title: 'Open Graph',
  type: 'object',
  description:
    'Control how your content appears when shared on social media platforms (e.g., Facebook, LinkedIn) or in messaging apps (e.g., Slack, WhatsApp).',
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      components: {
        input: SEOTitleFeedback,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      components: {
        input: SEODescriptionFeedback,
      },
    },
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    },
  ],
});
