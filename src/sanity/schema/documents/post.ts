import { DocumentTextIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';
import { defineField, defineType } from 'sanity';
import { GROUP, GROUPS } from '@/sanity/utils/constant';

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  groups: GROUPS,
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the post to show up in the preview',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: GROUP.MAIN_CONTENT,
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Required';
              }
              return true;
            });
          },
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'person' }],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      title: 'SEO & Metadata',
      name: 'seo',
      type: 'seoMetaFields',
      group: GROUP.SEO,
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, media, authorFirstName, authorLastName, date }) {
      const subtitles = [
        authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(' ') };
    },
  },
});
