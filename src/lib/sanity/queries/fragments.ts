export const imageFragment = /* groq */ `
  _type,
  crop {
    _type,
    right,
    top,
    left,
    bottom
  },
  hotspot {
    _type,
    x,
    y,
    height,
    width,
  },
  asset,
`;

export const openGraphFragment = /* groq */ `
  _type,
  description,
  title,
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  noIndex,
  metaDescription,
  metaImage{
    ${imageFragment}
  },
  generateCard,
  cardLayout,
  cardHeadline,
  cardExcerpt,
  openGraph {
    ${openGraphFragment}
  }
`;

export const linkFragment = /* groq */ `
  _type,
  type,
  openInNewTab,
  external,
  href,
  internal->{
    _type,
    _id,
    "slug": slug.current
  },
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    ${linkFragment}
  },
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  },
`;

export const buttonFragment = /* groq */ `
  _key,
  _type,
  variant,
  text,
  link {
    ${linkFragment}
  },
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    ${buttonFragment}
  },
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  subtitle,
  content[]{
    ...,
    ${markDefsFragment}
  },
  imagePosition,
  image,
`;

export const categoryFragment = /* groq */ `
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
`;

export const personFragment = /* groq */ `
  _id,
  _type,
  firstName,
  lastName,
  image,
  role,
  biography,
  "slug": slug.current,
`;

export const articleCardFragment = /* groq */ `
  _type,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  image,
  "categories": categories[]->{${categoryFragment}},
  "date": coalesce(date, _updatedAt),
  "author": author->{${personFragment}},
  readTime,
  countryInterest,
`;

const relatedArticlesFragment = /* groq */ `
  "relatedArticles": *[
    _type == "article" &&
    _id != ^.^._id &&
    references(^.category._ref)
  ] | order(_createdAt desc) [0...6] {
    ${articleCardFragment}
  },
`;

export const contentFragment = /* groq */ `
  content[]{
    ...,
    ${markDefsFragment}
    _type == "relatedArticles" => {${relatedArticlesFragment}}
  },
`;

export const articleFragment = /* groq */ `
  _updatedAt,
  ${articleCardFragment}
  ${contentFragment}
  seo {
    ${seoFragment}
  },
`;

export const articleListSectionFragment = /* groq */ `
    _type,
    heading,
    layout,
    "articles": select(
      layout == 'top-stories' => articles[]->{${articleCardFragment}},
      *[_type == 'article'] | order(_createdAt desc, _id desc) [0...10] {${articleCardFragment}}
    )
`;

export const heroSectionFragment = /* groq */ `
  _type,
  kicker,
  heading,
  tagline,
  image,
  article->{
    ${articleCardFragment}
  },
`;

export const pageBuilderFragment = /* groq */ `
  pageSections[]{
    ...,
    _key,
    _type,
    _type == 'hero' => {${heroSectionFragment}},
    _type == 'mediaText' => {${mediaTextSectionFragment}},
    _type == 'articleList' => {${articleListSectionFragment}}
  },
`;

export const menuItemFragment = /* groq */ `
  _type,
  _key,
  text,
  type,
  link {
    ${linkFragment}
  },
`;

export const menuFragment = /* groq */ `
  menu[]{
    ${menuItemFragment}
    childMenu[]{
      ${menuItemFragment}
    }
  }
`;

export const pageFragment = /* groq */ `
  ${pageBuilderFragment}
  seo {
    ${seoFragment}
  },
`;
