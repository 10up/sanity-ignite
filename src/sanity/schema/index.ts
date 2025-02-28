import person from './documents/person';
import page from './documents/page';
import post from './documents/post';
import homePage from './singletons/homePage';
import cta from './objects/sections/cta';
import hero from './objects/sections/hero';
import category from './documents/category';
import mediaText from './objects/sections/mediaText';
import postList from './objects/sections/postList';
import settings from './singletons/settings';
import link from './objects/link';
import blockContent from './objects/blockContent';
import seoTypes from './objects/seo';

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homePage,

  // Documents
  page,
  post,
  person,
  category,

  // Objects
  blockContent,
  cta,
  hero,
  link,
  mediaText,
  postList,
  ...seoTypes,
];
