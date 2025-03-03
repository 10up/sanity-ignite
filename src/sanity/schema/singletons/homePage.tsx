import { defineType, defineField } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import pageSections from '../fields/pageSections';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Home Page',
    }),
    pageSections,
    {
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
    },
  ],
});
