import { PanelLeftIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'mediaText',
  type: 'object',
  title: 'Media & Text',
  icon: PanelLeftIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      initialValue: 'left',
      title: 'Image position',
      options: { list: ['left', 'right'] },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled',
      };
    },
  },
});
