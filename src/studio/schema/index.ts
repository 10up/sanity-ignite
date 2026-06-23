import article from './documents/article';
import category from './documents/category';
import page from './documents/page';
import person from './documents/person';
import blockContent from './objects/blockContent';
import button from './objects/button';
import link from './objects/link';
import menuItem from './objects/menuItem';
import articleList from './objects/pageSections/articleList';
import card from './objects/pageSections/card';
import cardGrid from './objects/pageSections/cardGrid';
import cta from './objects/pageSections/cta';
import divider from './objects/pageSections/divider';
import hero from './objects/pageSections/hero';
import mediaText from './objects/pageSections/mediaText';
import subscribe from './objects/pageSections/subscribe';
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
