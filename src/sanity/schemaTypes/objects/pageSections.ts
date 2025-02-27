import { defineType } from 'sanity';

export default defineType({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: [{ type: 'cta' }, { type: 'hero' }, { type: 'mediaText' }, { type: 'postList' }],
  options: {
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
  },
});
