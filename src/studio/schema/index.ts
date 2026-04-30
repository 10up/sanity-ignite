import article from './documents/article';
import category from './documents/category';
import page from './documents/page';
import person from './documents/person';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import articleList from './objects/sections/articleList';
import card from './objects/sections/card';
import cardGrid from './objects/sections/cardGrid';
import cta from './objects/sections/cta';
import divider from './objects/sections/divider';
import hero from './objects/sections/hero';
import mediaText from './objects/sections/mediaText';
import subscribe from './objects/sections/subscribe';
import seoTypes from './objects/seo';
import blogPage from './singletons/articleArchivePage';
import homePage from './singletons/homePage';
import settings from './singletons/settings';

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  blogPage,

  // Documents
  page,
  article,
  person,
  category,

  // Sections
  cta,
  hero,
  mediaText,
  articleList,
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
