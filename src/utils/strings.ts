import type { PortableTextBlock } from 'next-sanity';

export const slugifyRegex = /^[a-zA-Z0-9-]+$/u;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 200)
    .split('')
    .filter((char) => slugifyRegex.test(char))
    .join('');

export function parseChildrenToSlug(children: PortableTextBlock['children']) {
  if (!children) return '';
  return slugify(children.map((child) => child.text).join(''));
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const upperCaseWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const wordCount = (str: string) => {
  return str.split(/\s+/).filter(Boolean).length;
};

export const readTime = (wordCount: number) => {
  const wordsPerMinute = 180;

  return Math.ceil(wordCount / wordsPerMinute);
};
