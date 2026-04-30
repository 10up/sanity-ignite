import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

export const blogSearchParams = {
  category: parseAsString,
  search: parseAsString,
  sort: parseAsStringEnum(['recent', 'oldest']).withDefault('recent'),
  page: parseAsInteger.withDefault(1),
};

export const loadBlogSearchParams = createLoader(blogSearchParams);
export const serializeBlogSearchParams = createSerializer(blogSearchParams);
