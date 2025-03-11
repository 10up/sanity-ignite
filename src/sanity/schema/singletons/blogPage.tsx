import { defineType, defineField } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import { defaultFieldGroups } from '../config/fieldGroups';

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: defaultFieldGroups,
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Blog Page',
      group: 'content',
    }),
    defineField({
      title: 'SEO & Metadata',
      name: 'seo',
      type: 'seoMetaFields',
      group: 'seo',
    }),
  ],
});
