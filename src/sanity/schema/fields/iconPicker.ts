import { defineField } from 'sanity';

export default defineField({
  name: 'icon',
  title: 'Icon',
  options: {
    storeSvg: true,
    providers: ['fi'],
  },
  type: 'iconPicker',
});
