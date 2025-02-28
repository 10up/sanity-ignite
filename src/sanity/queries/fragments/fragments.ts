export const twitterFragment = /* groq */ `
  _type,
  site,
  creator,
  cardType,
  handle
`;

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
  asset->{...}
`;

export const openGraphFragment = /* groq */ `
  _type,
  siteName,
  url,
  description,
  title,
  image {
    ${imageFragment}
  }
`;

export const metaAttributesFragment = /* groq */ `
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage {
    ${imageFragment}
  }
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  nofollowAttributes,
  seoKeywords,
  metaDescription,
  openGraph {
    ${openGraphFragment}
  }`;

export const linkFragment = /* groq */ `
  link {
      ...,
      _type == "link" => {
        "page": page->slug.current,
        "post": post->slug.current
        }
      }
`;

export const postFragment = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  image,
  "categories": categories[]->{title, description},
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  seo {
    ${seoFragment}
  }
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

export const heroSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  buttons[]{${buttonsFragment}}
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  media,
  mediaPosition,
  buttons[]{${buttonsFragment}}
`;

export const postListSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  posts[]{${postFragment}}
`;

export const ctaSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  buttons[]{${buttonsFragment}}
`;

export const featureCardFragment = /* groq */ `
  _type,
  heading,
  text,
  icon
`;

export const featureCardsSectionFragment = /* groq */ `
  ${featureCardFragment}
  cards[]{${featureCardFragment}}
`;

export const pageBuilderFragment = /* groq */ `
  pageSections[]{
    ...,
    _type,
    ${ctaSectionFragment},
    ${heroSectionFragment},
    ${mediaTextSectionFragment},
    ${postListSectionFragment},
    ${ctaSectionFragment},
    ${featureCardsSectionFragment},
  }
`;
