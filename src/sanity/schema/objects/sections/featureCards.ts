import { defineField, defineType } from 'sanity';
import { InlineIcon } from '@sanity/icons';
import { preview } from 'sanity-plugin-icon-picker';

defineField({
  name: 'icon',
  title: 'Icon',
  options: {
    storeSvg: true,
    providers: ['fi'],
  },
  type: 'iconPicker',
});

const featureCard = defineField({
  name: 'featureCard',
  type: 'object',
  icon: InlineIcon,
  title: 'Feature Cards',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'blockContent',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      options: {
        storeSvg: true,
        providers: ['fi'],
      },
      type: 'iconPicker',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      icon: 'icon',
    },
    prepare({ heading, icon }) {
      return {
        title: heading || 'Untitled',
        media: icon ? preview(icon) : null,
      };
    },
  },
});

export default defineType({
  name: 'featureCards',
  type: 'object',
  icon: InlineIcon,
  title: 'Feature Cards',
  fields: [
    ...featureCard.fields,
    defineField({
      name: 'cards',
      type: 'array',
      of: [featureCard],
    }),
  ],
});
