import { defineType, defineField } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Blog Page',
    }),
    {
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
    },
  ],
});
