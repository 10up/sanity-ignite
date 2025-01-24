import { defineQuery } from 'next-sanity';

export const twitterFragment = defineQuery(`{
  _type,
  site,
  creator,
  cardType,
  handle
}`);

export const imageFragment = defineQuery(`
_type,
crop{
_type,
right,
top,
left,
bottom
},
hotspot{
_type,
x,
y,
height,
width,
},
asset->{...}
`);

export const openGraphFragment = defineQuery(`
_type,
siteName,
url,
description,
title,
image{
${imageFragment}
}
`);

export const metaAttributesFragment = defineQuery(`
_type,
attributeValueString,
attributeType,
attributeKey,
attributeValueImage{
${imageFragment}
}
`);

export const seoFragment = defineQuery(`
_type,
metaTitle,
nofollowAttributes,
seoKeywords,
metaDescription,
openGraph{
${openGraphFragment}
},
twitter{
${twitterFragment}
},
additionalMetaTags[]{
_type,
metaAttributes[]{
${metaAttributesFragment}
}
}
`);

export const seo = `seo{
  ${seoFragment}
  }`;

const postFragment = defineQuery(`
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published");,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "category": category->{title, description},
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  ${seo},
`);

const linkFragment = defineQuery(`
  link {
      ...,
      _type == "link" => {
        "page": page->slug.current,
        "post": post->slug.current
        }
      }
`);

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
  ${seo},
}`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    pageSections,
    ${seo}
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc); {
    ${postFragment}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc); [0...$limit] {
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

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);
