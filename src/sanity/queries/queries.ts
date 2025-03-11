import { defineQuery } from 'next-sanity';
import { postFragment, pageFragment, menuFragment, categoryFragment } from './fragments/fragments';

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  title,
  description,
  ${menuFragment}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  ...,
  ${pageFragment}
}`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    ${pageFragment}
  }
`);

export const getSitemapQuery = defineQuery(`
  *[((_type in ["page", "post"] && defined(slug.current)) || (_type == "homePage")) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "post" => "/posts/" + slug.current,
      _type == "homePage" => "/",
      slug.current
    ),
    _updatedAt
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
    ${postFragment}
  }
`);

export const categoryQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug] [0] {
    ${categoryFragment}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)][0..$limit].slug.current
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)][0..$limit].slug.current
`);

export const categorySlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)][0..$limit].slug.current
`);

export const postsArchiveQuery = defineQuery(`
  {
    "allResults": *[
      _type == "post"
      &&
      (
        !defined( $filters.categorySlug ) || references(*[_type == "category" && slug.current == $filters.categorySlug]._id)
      )
      //
      // Add more filter here if needed
      //
      // The filter value should be passed as a property of the $filter parameter
      //
      // (
      //   !defined( $filters.anotherFilter ) || fieldname == $filters.anotherFilter)
      // )
    ] | order(_createdAt desc, _id desc)
  }
  {
    "total": count(allResults),
    "results": allResults[$from..$to] {
      ${postFragment}
    }
  }
`)
