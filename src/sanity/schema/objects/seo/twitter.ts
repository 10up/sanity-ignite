import { defineField } from 'sanity';

export default defineField({
  name: 'twitter',
  title: 'X.com',
  type: 'object',
  fields: [
    defineField({
      name: 'cardType',
      title: 'CardType',
      type: 'string',
    }),
    defineField({
      name: 'creator',
      title: 'Creator',
      type: 'string',
    }),
    defineField({
      name: 'site',
      title: 'Site',
      type: 'string',
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
    }),
  ],
});
