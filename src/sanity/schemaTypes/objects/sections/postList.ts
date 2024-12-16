import { defineField, defineType } from 'sanity'
import { ListIcon } from '@sanity/icons'

export default defineType({
  name: 'postList',
  title: 'Post List',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare(selection) {
      const { title } = selection

      return {
        title: title,
        subtitle: 'Post List',
      }
    },
  },
})
