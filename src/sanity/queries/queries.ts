import { defineQuery } from 'next-sanity';
import { seoFragment, postFragment, linkFragment } from './fragments/fragments';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  menuItems[]->{
    _id,
    _type,
    slug,
    name,
    isHome
  }
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  pageSections,
  seo {
    ${seoFragment}
  },
}`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    pageSections,
    seo {
      ${seoFragment}
    }
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFragment}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFragment}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkFragment}
    }
  },
    ${postFragment}
  }
`);

export const postPagesSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);
