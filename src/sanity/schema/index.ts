import person from './documents/person';
import page from './documents/page';
import post from './documents/post';
import homePage from './singletons/homePage';
import cta from './objects/sections/cta';
import hero from './objects/sections/hero';
import category from './documents/category';
import mediaText from './objects/sections/mediaText';
import postList from './objects/sections/postList';
import cardGrid from './objects/sections/cardGrid';
import settings from './singletons/settings';
import blockContent from './objects/blockContent';
import url from './objects/url';
import button from './objects/button';
import blogPage from './singletons/blogPage';
import card from './objects/sections/card';
import divider from './objects/sections/divider';
import subscribe from './objects/sections/subscribe';
import menuItem from './objects/menuItem';
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
  url,
  button,
  menuItem,
];
