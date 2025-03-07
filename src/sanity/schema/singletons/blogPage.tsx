import { defineType, defineField } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import { GROUP, GROUPS } from '@/sanity/utils/constant';

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: GROUPS,
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Blog Page',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      title: 'SEO & Metadata',
      name: 'seo',
      type: 'seoMetaFields',
      group: GROUP.SEO,
    }),
  ],
});
