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
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Top Stories', value: 'top-stories' },
          { title: 'Latest Articles', value: 'latest-articles' },
        ],
        layout: 'radio',
      },
      initialValue: 'top-stories',
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ parent }) => parent?.layout !== 'top-stories',
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const p = parent as { layout?: string };
          if (p?.layout !== 'top-stories') return true;
          if (!value || (value as unknown[]).length !== 4)
            return 'Top Stories requires exactly 4 articles';
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      layout: 'layout',
    },
    prepare({ title, layout }) {
      return {
        title: `[Article List] ${title || 'Untitled'}`,
        layout: layout,
      };
    },
  },
});
