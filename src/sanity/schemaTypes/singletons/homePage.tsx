import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'name',
      hidden: true,
      readOnly: true,
      type: 'string',
      initialValue: 'Home Page',
    }),
    defineField({
      name: 'pageSections',
      title: 'Page Sections',
      type: 'array',
      of: [{ type: 'cta' }, { type: 'hero' }, { type: 'mediaText' }, { type: 'postList' }],
      /*options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },*/
    }),
    {
      title: 'Seo',
      name: 'seo',
      type: 'seoMetaFields',
    },
  ],
})
