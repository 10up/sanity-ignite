import { defineField } from 'sanity';

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: [
    { type: 'cta' },
    { type: 'hero' },
    { type: 'mediaText' },
    { type: 'postList' },
    { type: 'cardGrid' },
    { type: 'divider' },
    { type: 'subscribe' },
  ],
});
