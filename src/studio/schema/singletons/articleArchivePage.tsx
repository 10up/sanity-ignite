import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { defaultFieldGroups } from '../config/fieldGroups';

export default defineType({
  name: 'articleArchivePage',
  title: 'Article Archive Page',
  type: 'document',
  groups: defaultFieldGroups,
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      initialValue: 'Articles',
      group: 'content',
    }),
    defineField({
      name: 'featuredArticle',
      title: 'Featured Article',
      type: 'reference',
      to: [{ type: 'article' }],
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
