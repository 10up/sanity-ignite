import { defineField, defineType } from 'sanity';
import { EqualIcon } from '@sanity/icons';

export default defineType({
  name: 'subscribe',
  title: 'Subscribe',
  type: 'object',
  icon: EqualIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: () => 'Sign Up',
      validation: (Rule) => Rule.required(),
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
        subtitle: 'Subscribe',
      };
    },
  },
});
