import { defineQuery } from 'next-sanity';
import {
  articleCardFragment,
  articleFragment,
  categoryFragment,
  contentFragment,
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
  defineQuery(`*[_type == "category" && slug.current == $slug][0]{
  "category": coalesce(parent->, @){
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    "children": *[_type == "category" && references(^._id)] | order(title asc) {
      title,
      "slug": slug.current
    },
    seo {
      ${seoFragment}
    }
  }
}.category`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    excerpt,
    ${contentFragment}
    seo {
      ${seoFragment}
    }
  }
`);

export const getSitemapQuery = defineQuery(`
  *[((_type in ["page", "article", "category"] && defined(slug.current)) || (_type == "homePage")) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "article" => "/article/" + slug.current,
      _type == "category" => "/category/" + select(defined(parent) => parent->slug.current + "/", "") + slug.current,
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

export const getPageSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)][0..$limit].slug.current
`);

// Indexable pages with titles, used to build the /llms.txt index.
export const navPagesQuery = defineQuery(`
  *[_type == "page" && defined(slug.current) && seo.noIndex != true] | order(name asc) {
    "title": name,
    "slug": slug.current
  }
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
  *[_type == "article" && defined(slug.current)] | order(_createdAt desc) [0...$size] {
    ${articleCardFragment}
  }
`);

export const latestCategoryArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current) && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(_createdAt desc) [0...$size] {
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

// Semantic search over the dataset embeddings index. `text::semanticSimilarity`
// is only valid as an argument to `score()`, and requires embeddings to be
// enabled on the dataset (`npm run embeddings:enable`). `_embeddings` (the raw
// match-fragment metadata) is intentionally omitted — it's large and unused on
// the client. See https://www.sanity.io/docs/content-lake/dataset-embeddings
export const searchArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)]
  | score(text::semanticSimilarity($searchTerm))
  | order(_score desc)
  [0...10] {
    _id,
    _score,
    title,
    "slug": slug.current,
    "summary": excerpt
  }
`);
