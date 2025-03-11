import { ComposeIcon, SearchIcon } from '@sanity/icons';
import type { FieldGroupDefinition } from 'sanity';

export const GROUP = {
  SEO: 'seo',
  MAIN_CONTENT: 'main-content',
};

export const GROUPS: FieldGroupDefinition[] = [
  {
    name: GROUP.MAIN_CONTENT,
    icon: ComposeIcon,
    title: 'Main Content',
  },
  { name: GROUP.SEO, icon: SearchIcon, title: 'SEO & Metadata' },
];
