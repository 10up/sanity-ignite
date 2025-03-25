import type { DocumentActionsResolver } from 'sanity';
import { singletonTypesNames } from '../schema';

const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

export const documentActions: DocumentActionsResolver = (inputDocumentActions, context) => {
  const isSingleton = singletonTypesNames.includes(context.schemaType);

  /**
   * If the document is a singleton, only return the actions that are allowed for singletons
   *
   * E.g. remove the "delete" and "duplicate" actions
   */
  if (isSingleton) {
    return inputDocumentActions.filter(({ action }) => action && singletonActions.has(action));
  }

  return inputDocumentActions;
};
