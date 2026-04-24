import { defineArrayMember, defineField } from 'sanity';
import articleList from '../objects/sections/articleList';
import cardGrid from '../objects/sections/cardGrid';
import cta from '../objects/sections/cta';
import divider from '../objects/sections/divider';
import hero from '../objects/sections/hero';
import mediaText from '../objects/sections/mediaText';
import subscribe from '../objects/sections/subscribe';

const pageSectionsObjects = [
  cardGrid,
  cta,
  divider,
  hero,
  mediaText,
  articleList,
  subscribe,
];

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: pageSectionsObjects.map(({ name }) => defineArrayMember({ type: name })),
  group: 'content',
});
