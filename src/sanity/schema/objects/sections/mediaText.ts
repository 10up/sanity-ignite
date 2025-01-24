import { defineField, defineType } from 'sanity'
import { PanelLeftIcon } from '@sanity/icons'

export default defineType({
  name: 'mediaText',
  type: 'object',
  title: 'Media & Text',
  icon: PanelLeftIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'text',
      type: 'blockContent',
    }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      initialValue: 'left',
      title: 'Image position',
      options: { list: ['left', 'right'] },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled',
      }
    },
  },
})
