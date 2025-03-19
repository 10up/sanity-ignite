import type { FieldGroupDefinition } from 'sanity';

export const defaultFieldGroups: FieldGroupDefinition[] = [
  {
    name: 'content',
    title: 'Content',
    default: true,
  },
  {
    name: 'seo',
    title: 'SEO',
  },
];
