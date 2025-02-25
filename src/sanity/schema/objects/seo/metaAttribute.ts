import { defineType } from 'sanity';

export default defineType({
  name: 'metaAttribute',
  title: 'Meta Attribute',
  type: 'object',
  fields: [
    {
      name: 'attributeKey',
      title: 'Key',
      type: 'string',
    },
    {
      name: 'attributeType',
      title: 'type',
      type: 'string',
      options: {
        list: ['string', 'image'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'image',
    },
    {
      name: 'attributeValueImage',
      title: 'Value',
      type: 'image',
      hidden: ({ parent }) => parent?.attributeType !== 'image',
    },
    {
      name: 'attributeValueString',
      title: 'Value',
      type: 'string',
      hidden: ({ parent }) => parent?.attributeType !== 'string',
    },
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
