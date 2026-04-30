import { FolderIcon, TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'parent',
      title: 'Parent category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        disableNew: true,
        filter: '!defined(parent)',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'parent.title',
      parent: 'parent',
    },
    prepare({ title, subtitle, parent }) {
      return {
        title,
        subtitle: subtitle ? `↳ ${subtitle}` : undefined,
        media: parent ? TagIcon : FolderIcon,
      };
    },
  },
});
