import { BlockquoteIcon, ImageIcon } from '@sanity/icons';
import { LayoutPanelTop, Subscript, Superscript } from 'lucide-react';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
      ],
      marks: {
        decorators: [
          { title: 'Code', value: 'code' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Strong', value: 'strong' },
          { title: 'Underline', value: 'underline' },
          {
            title: 'Sup',
            value: 'sup',
            icon: Superscript,
            component: ({ children }) => <sup>{children}</sup>,
          },
          {
            title: 'Sub',
            value: 'sub',
            icon: Subscript,
            component: ({ children }) => <sub>{children}</sub>,
          },
        ],
        annotations: [
          {
            name: 'customLink',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'customLink',
                type: 'link',
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
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
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'blockQuote',
      title: 'Quote',
      icon: BlockquoteIcon,
      fields: [
        defineField({
          name: 'quote',
          type: 'text',
          title: 'Quote',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'cite',
          type: 'string',
          title: 'Attribution',
        }),
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'relatedArticles',
      title: 'Related Articles',
      description: 'Select a category to display inline related articles.',
      icon: LayoutPanelTop,
      fields: [
        defineField({
          name: 'category',
          type: 'reference',
          to: [{ type: 'category' }],
          validation: (Rule) =>
            Rule.required().error(
              'Please select a category to display related articles.'
            ),
        }),
      ],
      preview: {
        select: {
          categoryTitle: 'category.title',
        },
        prepare({ categoryTitle }) {
          return {
            title: 'Related Articles',
            subtitle: categoryTitle
              ? `Category: ${categoryTitle}`
              : 'No category selected',
          };
        },
      },
    }),
  ],
});
