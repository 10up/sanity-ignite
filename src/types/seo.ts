export type SeoType = {
  _type?: 'seoMetaFields';
  nofollowAttributes?: boolean | null;
  metaDescription?: string | null;
  additionalMetaTags?: MetaTagType[] | null;
  metaTitle?: string | null;
  seoKeywords?: string[] | null;
  openGraph?: OpenGraphType | null;
  twitter?: Twitter | null;
};

export type MetaTagType = {
  _type: 'metaTag';
  metaAttributes?: MetaAttributeType[];
};

export type MetaAttributeType = {
  _type: 'metaAttribute';
  attributeKey?: string;
  attributeType?: string;
  attributeValueString?: string;
  attributeValueImage?: CustomImageType;
};

export type OpenGraphType = {
  _type: 'openGraph';
  title: string | null;
  url?: string | null;
  siteName?: string | null;
  description: string | null;
  image: CustomImageType | null;
};

export type Twitter = {
  _type: 'twitter';
  handle?: string | null;
  creator?: string | null;
  site?: string | null;
  cardType?: string | null;
};

export type CustomImageType = {
  _type: 'image';
  asset?: SanityImageAssetType | null;
  crop?: {
    _type: 'sanity.imageCrop';
    right: number | null;
    top: number | null;
    left: number | null;
    bottom: number | null;
  } | null;
  hotspot?: {
    x: number | null;
    y: number | null;
    height: number | null;
    _type: 'sanity.imageHotspot';
    width?: number | null;
  } | null;
};

export type SanityImageAssetType = {
  _type?: 'sanity.imageAsset';
  _id?: string;
  path?: string;
  url?: string;
  metadata?: {
    _type?: 'sanity.imageMetadata';
    dimensions?: {
      _type?: 'sanity.imageDimensions';
      height?: number;
      width?: number;
    };
  };
};
