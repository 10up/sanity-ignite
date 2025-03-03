import person from './documents/person';
import page from './documents/page';
import post from './documents/post';
import homePage from './singletons/homePage';
import cta from './objects/sections/cta';
import hero from './objects/sections/hero';
import category from './documents/category';
import mediaText from './objects/sections/mediaText';
import postList from './objects/sections/postList';
import featureCards from './objects/sections/featureCards';
import settings from './singletons/settings';
import link from './objects/link';
import blockContent from './objects/blockContent';
import url from './objects/url';
import button from './objects/button';
import blogPage from './singletons/blogPage';

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  blogPage,
  // Documents
  page,
  post,
  person,
  category,

  cta,
  hero,
  mediaText,
  postList,
  featureCards,

  // Objects
  blockContent,
  link,
  url,
  button,
];
