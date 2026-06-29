import { defineArrayMember, defineField } from 'sanity';
import articleList from '../objects/pageSections/articleList';
import hero from '../objects/pageSections/hero';
import mediaText from '../objects/pageSections/mediaText';

const pageSectionsObjects = [hero, mediaText, articleList];

export default defineField({
  name: 'pageSections',
  title: 'Page Sections',
  type: 'array',
  of: pageSectionsObjects.map(({ name }) => defineArrayMember({ type: name })),
  group: 'content',
});
