import { defineQuery } from 'next-sanity';
import {
  articleCardFragment,
  articleFragment,
  categoryFragment,
  menuFragment,
  pageFragment,
  seoFragment,
} from './fragments';

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

export const categoryQuery =
  defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
  "featuredArticle": featuredArticle->{
    ${articleCardFragment}
  },
  seo {
    ${seoFragment}
  }
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
  *[((_type in ["page", "article"] && defined(slug.current)) || (_type == "homePage")) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "article" => "/articles/" + slug.current,
      _type == "homePage" => "/",
      slug.current
    ),
    _updatedAt
  }
`);

export const articleQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug] [0] {
    ${articleFragment}
  }
`);

export const pageSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)][0..$limit].slug.current
`);

export const articleSlugs = defineQuery(`
  *[_type == "article" && defined(slug.current)][0..$limit].slug.current
`);

export const allCategoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    ${categoryFragment}
  }
`);

const articlesArchiveBase = (order: string) => /* groq */ `
  {
    "allResults": *[
      _type == "article"
      &&
      (
        !defined( $filters.categorySlug ) || references(*[_type == "category" && slug.current == $filters.categorySlug]._id)
      )
      &&
      (
        !defined( $filters.search ) || title match $filters.search + "*"
      )
    ] | order(${order})
  }
  {
    "total": count(allResults),
    "results": allResults[$from..$to] {
      ${articleCardFragment}
    }
  }
`;

export const articlesArchiveQuery = defineQuery(
  articlesArchiveBase('_createdAt desc, _id desc')
);

export const articlesArchiveOldestQuery = defineQuery(
  articlesArchiveBase('_createdAt asc, _id asc')
);

export const latestArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(_createdAt desc) [0...10] {
    ${articleCardFragment}
  }
`);
export const recommendedArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)]
  | score($country in countryInterest)
  | order(_createdAt desc)
  [0...10] {
    ${articleCardFragment}
  }
`);
