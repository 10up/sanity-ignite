import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { defaultFieldGroups } from '../config/fieldGroups';

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */
export default defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  icon: DocumentIcon,
  groups: defaultFieldGroups,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
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
