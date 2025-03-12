import { defineArrayMember, defineField } from 'sanity';
import cta from '../objects/sections/cta';
import hero from '../objects/sections/hero';
import mediaText from '../objects/sections/mediaText';
import postList from '../objects/sections/postList';
import cardGrid from '../objects/sections/cardGrid';
import divider from '../objects/sections/divider';
import subscribe from '../objects/sections/subscribe';

const pageSectionsObjects = [cardGrid, cta, divider, hero, mediaText, postList, subscribe];

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: pageSectionsObjects.map(({ name }) => defineArrayMember({ type: name })),
});
