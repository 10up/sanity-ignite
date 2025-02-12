import groq from 'groq';

export const twitterFragment = groq`
  _type,
  site,
  creator,
  cardType,
  handle
`;

export const imageFragment = groq`
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

export const openGraphFragment = groq`
  _type,
  siteName,
  url,
  description,
  title,
  image {
    ${imageFragment}
  }
`;

export const metaAttributesFragment = groq`
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage {
    ${imageFragment}
  }
`;

export const seoFragment = groq`
  _type,
  metaTitle,
  nofollowAttributes,
  seoKeywords,
  metaDescription,
  openGraph {
    ${openGraphFragment}
  }`;

export const linkReferenceFragment = groq`
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

export const linkFragment = groq`
  link {
    ...,
    ${linkReferenceFragment}
  }
`;

export const postFragment = groq`
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "category": category->{title, description},
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  seo {
    ${seoFragment}
  }
`;
