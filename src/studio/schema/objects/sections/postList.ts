import { ListIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'postList',
  title: 'Post List',
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
      name: 'numberOfPosts',
      title: 'Number of Posts to Show',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(20),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare(selection) {
      const { title } = selection;

      return {
        title: title,
        subtitle: 'Post List',
      };
    },
  },
});
