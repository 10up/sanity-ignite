import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import pageSections from '../fields/pageSections';
import { GROUP, GROUPS } from '@/sanity/utils/constant';

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */
export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  groups: GROUPS,
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
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
