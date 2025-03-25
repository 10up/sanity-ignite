import type { NewDocumentOptionsResolver } from 'sanity';
import { singletonTypesNames } from '../schema';

export const newDocumentOptions: NewDocumentOptionsResolver = (prev, { creationContext }) => {
  if (creationContext.type === 'global') {
    return prev.filter((templateItem) => !singletonTypesNames.includes(templateItem.templateId));
  }

  return prev;
};
