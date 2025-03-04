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
