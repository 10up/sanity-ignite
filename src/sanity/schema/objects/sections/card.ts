import { defineField } from 'sanity';
import { InlineIcon } from '@sanity/icons';

export default defineField({
  name: 'card',
  type: 'object',
  icon: InlineIcon,
  title: 'Card',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      icon: 'icon',
    },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled',
      };
    },
  },
});
