import { LinkIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { createRadioListLayout } from '@/utils/schema';

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  icon: LinkIcon,
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Menu Item Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: createRadioListLayout(['link', 'child-menu']),
      initialValue: () => 'link',
    }),

    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      hidden: ({ parent }) => parent?.type !== 'link',
    }),
    defineField({
      name: 'childMenu',
      title: 'Child Menu',
      description: 'Add a child menu to the menu item.',
      hidden: ({ parent }) => parent?.type !== 'child-menu',
      type: 'array',
      of: [{ type: 'menuItem' }],
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare: ({ text }) => {
      return {
        title: text || 'Untitled Menu Item',
      };
    },
  },
});
