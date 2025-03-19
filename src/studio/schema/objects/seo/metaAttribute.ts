import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'metaAttribute',
  title: 'Meta Attribute',
  type: 'object',
  fields: [
    defineField({
      name: 'attributeKey',
      title: 'Key',
      type: 'string',
    }),
    defineField({
      name: 'attributeType',
      title: 'type',
      type: 'string',
      options: {
        list: ['string', 'image'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'attributeValueImage',
      title: 'Value',
      type: 'image',
      hidden: ({ parent }) => parent?.attributeType !== 'image',
    }),
    defineField({
      name: 'attributeValueString',
      title: 'Value',
      type: 'string',
      hidden: ({ parent }) => parent?.attributeType !== 'string',
    }),
  ],
  preview: {
    select: {
      title: 'attributeKey',
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
});
