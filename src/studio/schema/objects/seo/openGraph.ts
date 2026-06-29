import { defineField } from 'sanity';
import SEODescription from '@/studio/components/SEODescription';
import SEOTitle from '@/studio/components/SEOTitle';

export default defineField({
  name: 'openGraph',
  title: 'Open Graph',
  type: 'object',
  description:
    'Optional per-page text overrides for how your content appears when shared on social media platforms (e.g., Facebook, LinkedIn) or in messaging apps (e.g., Slack, WhatsApp). The share image is set by the Meta / Social Image field above; the URL and site name are derived automatically.',
  fields: [
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
  ],
});
