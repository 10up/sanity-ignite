import { Link } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import { createRadioListLayout } from '@/utils/schema';

const allLinkableTypes = [{ type: 'post' }, { type: 'page' }];

export default defineType({
  name: 'link',
  type: 'object',
  icon: Link,
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: createRadioListLayout(['internal', 'external']),
      initialValue: () => 'external',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      description: 'If checked, the link will open in a new tab.',
      initialValue: () => false,
    }),
    defineField({
      name: 'external',
      type: 'string',
      title: 'URL',
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
    defineField({
      name: 'href',
      type: 'string',
      initialValue: () => '#',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'internal',
      type: 'reference',
      options: { disableNew: true },
      hidden: ({ parent }) => parent?.type !== 'internal',
      to: allLinkableTypes,
    }),
  ],
  preview: {
    select: {
      externalUrl: 'external',
      urlType: 'type',
      internalUrl: 'internal.slug.current',
      openInNewTab: 'openInNewTab',
    },
    prepare({ externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === 'external' ? externalUrl : `/${internalUrl}`;
      const newTabIndicator = openInNewTab ? ' ↗' : '';
      const truncatedUrl = url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: `${urlType === 'external' ? 'External' : 'Internal'} Link`,
        subtitle: `${truncatedUrl}${newTabIndicator}`,
      };
    },
  },
});
