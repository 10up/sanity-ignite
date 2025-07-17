import { MenuIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'menu',
  type: 'object',
  icon: MenuIcon,
  title: 'Menu',
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [{ type: 'menuItem' }],
    }),
  ],
});
