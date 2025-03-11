export type SeoType = {
  _type: 'seoMetaFields';
  noIndex?: boolean;
  additionalMetaTags?: MetaTagType[];
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: CustomImageType;
  seoKeywords?: string[];
  openGraph?: OpenGraphType;
  twitter?: Twitter;
};

export type MetaTagType = {
  _type: 'metaTag';
  metaAttributes?: MetaAttributeType[];
};

export type MetaAttributeType = {
  _type: 'metaAttribute';
  attributeKey?: string;
  attributeType?: 'string' | 'image';
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
  asset?: SanityImageAssetType;
  crop?: {
    _type: 'sanity.imageAsset';
    right: number;
    top: number;
    left: number;
    bottom: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    _type: 'sanity.imageHotspot';
    width?: number;
  };
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
