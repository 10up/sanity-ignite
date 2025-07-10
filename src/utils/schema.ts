import type { StringOptions } from 'sanity';
import { upperCaseWords } from './strings';

export const createRadioListLayout = (
  items: Array<string | { title: string; value: string }>,
  options?: StringOptions,
): StringOptions => {
  const list = items.map((item) => {
    if (typeof item === 'string') {
      return {
        title: upperCaseWords(item.replace('-', ' ')),
        value: item,
      };
    }
    return item;
  });
  return {
    layout: 'radio',
    list,
    ...options,
  };
};
