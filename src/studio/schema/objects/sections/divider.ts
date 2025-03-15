import { defineField, defineType } from 'sanity';
import { RemoveIcon } from '@sanity/icons';

export default defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: RemoveIcon,
  fields: [
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(100),
      description: 'The height of the divider in pixels',
    }),
  ],
  preview: {
    prepare() {
      return { title: `Divider` };
    },
  },
});
