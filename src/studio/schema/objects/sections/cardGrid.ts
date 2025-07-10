import { InlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import card from './card';

export default defineType({
  name: 'cardGrid',
  type: 'object',
  icon: InlineIcon,
  title: 'Card Grid',
  fields: [
    ...card.fields,
    defineField({
      name: 'cards',
      type: 'array',
      of: [card],
    }),
  ],
});
