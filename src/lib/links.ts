import { clientEnv } from '@/env/clientEnv';

type SupportedDocumentTypes = 'page' | 'post' | 'homePage' | 'category' | 'person';

export const getBaseURL = () => {
  return clientEnv.NEXT_PUBLIC_SITE_URL || '';
};

/**
 * Generic function to generate a link to a document based on its type and slug
 */
export const getDocumentLink = (
  { _type, slug }: { _type: SupportedDocumentTypes; slug: string | null },
  absolute: boolean = false,
) => {
  const linkBase = absolute ? getBaseURL() : '';

  switch (_type) {
    case 'page':
      return `${linkBase}/${slug}`;
    case 'post':
      return `${linkBase}/blog/${slug}`;
    case 'category':
      return `${linkBase}/category/${slug}`;
    case 'homePage':
      return `${linkBase}/`;
    default:
      return `${linkBase}/`;
  }
};
