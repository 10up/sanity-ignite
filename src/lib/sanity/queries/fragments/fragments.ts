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

export const additionalMetaTagFragment = /* groq */ `
  _key,
  _type,
  metaAttributes[] {
    ${metaAttributesFragment}
  }
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  noIndex,
  seoKeywords,
  metaDescription,
  additionalMetaTags[]{
    ${additionalMetaTagFragment}
  },
  openGraph {
    ${openGraphFragment}
  },
  twitter {
    ${twitterFragment}
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const contentFragment = /* groq */ `
  content[]{
    ...,
    ${markDefsFragment}
  }
`;

export const urlFragment = /* groq */ `
  _type,
  "openInNewTab": url.openInNewTab,
  "href": select(
    url.type == "internal" => url.internal->slug.current,
    url.type == "external" => url.external,
    url.href
  )
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    ${urlFragment}
  }
`;

export const heroSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  media,
  mediaPosition,
  ${buttonsFragment}
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
  ...,
  firstName,
  lastName,
  image
`;

export const postFragment = /* groq */ `
  _id,
  ...,
  ${contentFragment},
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  image,
  "categories": categories[]->{${categoryFragment}},
  "date": coalesce(date, _updatedAt),
  "author": author->{${personFragment}},
  seo {
    ${seoFragment}
  }
`;

export const postListSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${postFragment}
`;

export const dividerSectionFragment = /* groq */ `
  _type,
  height
`;

export const ctaSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const subscribeSectionFragment = /* groq */ `
  _type,
  heading,
  text
`;

export const cardGridFragment = /* groq */ `
  _type,
  heading,
  ${contentFragment},
  icon
`;

export const cardGridsSectionFragment = /* groq */ `
  ${cardGridFragment},
  cards[]{${cardGridFragment}}
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
    ${cardGridsSectionFragment},
    ${dividerSectionFragment},
    ${subscribeSectionFragment}
  }
`;

export const menuItemFragment = /* groq */ `
  _type,
  _key,
  text,
  type,
  ${urlFragment}
`;

export const menuFragment = /* groq */ `
  menu[]{
  ${menuItemFragment},
  childMenu[]{
    ${menuItemFragment}
  }
  }
`;

export const pageFragment = /* groq */ `
  ${pageBuilderFragment},
  seo {
    ${seoFragment}
  },
`;
