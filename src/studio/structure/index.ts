import { CogIcon, DocumentIcon, HomeIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      S.listItem()
        .title('Blog Page')
        .child(S.document().schemaType('blogPage').documentId('blogPage'))
        .icon(DocumentIcon),
      // Filter out "AI Assist Context" and "Settings" content from the list of content types
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return typeof id !== 'undefined'
          ? !['settings', 'homePage', 'assist.instruction.context', 'blogPage'].includes(id)
          : false;
      }),
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ]);
