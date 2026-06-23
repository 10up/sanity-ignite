import { defineArrayMember, defineField } from 'sanity';
import articleList from '../objects/pageSections/articleList';
import cardGrid from '../objects/pageSections/cardGrid';
import cta from '../objects/pageSections/cta';
import divider from '../objects/pageSections/divider';
import hero from '../objects/pageSections/hero';
import mediaText from '../objects/pageSections/mediaText';
import subscribe from '../objects/pageSections/subscribe';

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
