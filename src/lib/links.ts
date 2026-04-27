import { clientEnv } from '@/env/clientEnv';
import type { LinkFragmentType } from './sanity/queries/schemas';

export const getBaseURL = () => {
  return clientEnv.NEXT_PUBLIC_SITE_URL || '';
};

/**
 * Generic function to generate a link to a document based on its type and slug
 */
export const getDocumentLink = (
  { _type, slug }: { _type: string; slug: string | null | undefined },
  absolute: boolean = false
) => {
  const linkBase = absolute ? getBaseURL() : '';

  switch (_type) {
    case 'page':
      return `${linkBase}/${slug}`;
    case 'article':
      return `${linkBase}/article/${slug}`;
    case 'category':
      return `${linkBase}/articles?category=${slug}`;
    case 'homePage':
      return `${linkBase}/`;
    default:
      return `${linkBase}/`;
  }
};

export const getLinkByLinkObject = (
  link: Pick<LinkFragmentType, 'type' | 'external' | 'internal'>
) => {
  const { type, external, internal } = link;

  if (type === 'external') {
    return external || '';
  }

  if (type === 'internal' && internal) {
    return getDocumentLink(internal, false);
  }
};
