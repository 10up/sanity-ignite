import { ListIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'articleList',
  title: 'Article List',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'numberOfArticles',
      title: 'Number of Articles to Show',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(20),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: `[Article List] ${title || 'Untitled'}`,
      };
    },
  },
});
