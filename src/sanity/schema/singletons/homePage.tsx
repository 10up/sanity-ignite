import { defineType, defineField } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import pageSections from '../fields/pageSections';
import { GROUP, GROUPS } from '@/sanity/utils/constant';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: GROUPS,
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Home Page',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      ...pageSections,
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
