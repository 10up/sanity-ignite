import { defineField } from 'sanity';

export default defineField({
  name: 'twitter',
  title: 'Twitter',
  type: 'object',
  fields: [
    {
      name: 'cardType',
      title: 'CardType',
      type: 'string',
    },
    {
      name: 'creator',
      title: 'Creator',
      type: 'string',
    },
    {
      name: 'site',
      title: 'Site',
      type: 'string',
    },
    {
      name: 'handle',
      title: 'Handle',
      type: 'string',
    },
  ],
});
