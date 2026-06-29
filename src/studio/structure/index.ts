import { CogIcon, HomeIcon } from '@sanity/icons';
import { FileText } from 'lucide-react';
import type { StructureResolver } from 'sanity/structure';

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('homePage')
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      S.listItem()
        .id('article')
        .title('Articles')
        .child(S.documentTypeList('article').title('Articles'))
        .icon(FileText),
      // Filter out all items manually added to the list
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return typeof id !== 'undefined'
          ? ![
              'settings',
              'article',
              'homePage',
              'assist.instruction.context',
            ].includes(id)
          : false;
      }),
      S.listItem()
        .id('settings')
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ]);
