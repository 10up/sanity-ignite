import { defineField } from 'sanity';

export default defineField({
  name: 'metaTag',
  title: 'Meta tag',
  type: 'object',
  fields: [
    defineField({
      name: 'metaAttributes',
      title: 'Meta Attributes',
      type: 'array',
      of: [{ type: 'metaAttribute' }],
    }),
  ],
  preview: {
    select: {
      title: 'attributeName',
      metaTags: 'metaAttributes',
    },
    prepare({ metaTags }) {
      return {
        title:
          metaTags && metaTags[0]?.attributeValueString
            ? metaTags[0]?.attributeValueString
            : 'Meta Tag',
      };
    },
  },
});
