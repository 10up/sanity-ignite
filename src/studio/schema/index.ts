import category from './documents/category';
import page from './documents/page';
import person from './documents/person';
import post from './documents/post';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import card from './objects/sections/card';
import cardGrid from './objects/sections/cardGrid';
import cta from './objects/sections/cta';
import divider from './objects/sections/divider';
import hero from './objects/sections/hero';
import mediaText from './objects/sections/mediaText';
import postList from './objects/sections/postList';
import subscribe from './objects/sections/subscribe';
import seoTypes from './objects/seo';
import blogPage from './singletons/blogPage';
import homePage from './singletons/homePage';
import settings from './singletons/settings';

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

  // Sections
  cta,
  hero,
  mediaText,
  postList,
  card,
  cardGrid,
  divider,
  subscribe,

  // Objects
  blockContent,
  link,
  button,
  menuItem,
  ...seoTypes,
];
