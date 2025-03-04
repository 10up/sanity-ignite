import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';
import pageSections from '../fields/pageSections';

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */
export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
    }),
    pageSections,
    {
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
    },
  ],
});
