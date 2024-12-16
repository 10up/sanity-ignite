import { defineQuery } from 'next-sanity'

export const twitterQuery = /* groq */ `
_type,
site,
creator,
cardType,
handle
`

export const imageFields = /* groq */ `
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
`

export const openGraphQuery = /* groq */ `
_type,
siteName,
url,
description,
title,
image{
${imageFields}
}
`

export const metaAttributesQuery = /* groq */ `
_type,
attributeValueString,
attributeType,
attributeKey,
attributeValueImage{
${imageFields}
}
`

export const seoFields = /* groq */ `
_type,
metaTitle,
nofollowAttributes,
seoKeywords,
metaDescription,
openGraph{
${openGraphQuery}
},
twitter{
${twitterQuery}
},
additionalMetaTags[]{
_type,
metaAttributes[]{
${metaAttributesQuery}
}
}
`
export const seo = `seo{
  ${seoFields}
  }`

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "category": category->{title, description},
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  ${seo},
`

const linkFields = /* groq */ `
  link {
      ...,
      _type == "link" => {
        "page": page->slug.current,
        "post": post->slug.current
        }
      }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  menuItems[]->{
    _id,
    _type,
    slug,
    name,
    isHome
  }
}`)

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  pageSections,
  ${seo},
}`)

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    pageSections,
    ${seo}
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkFields}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
