export type SeoType = {
  _type?: 'seo'
  nofollowAttributes?: boolean
  metaDescription?: string
  additionalMetaTags?: MetaTagType[]
  metaTitle?: string
  seoKeywords?: string[]
  openGraph?: OpenGraphType
  twitter?: Twitter
}

export type MetaTagType = {
  _type: 'metaTag'
  metaAttributes?: MetaAttributeType[]
}

export type MetaAttributeType = {
  _type: 'metaAttribute'
  attributeKey?: string
  attributeType?: string
  attributeValueString?: string
  attributeValueImage?: CustomImageType
}

export type OpenGraphType = {
  _type: 'openGraph'
  title: string
  url?: string
  siteName?: string
  description: string
  image: CustomImageType
}

export type Twitter = {
  _type: 'twitter'
  handle?: string
  creator?: string
  site?: string
  cardType?: string
}

export type CustomImageType = {
  _type: 'customImage'
  asset?: SanityImageAssetType
  crop?: {
    _type: 'SanityImageCrop'
    right: number
    top: number
    left: number
    bottom: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    _type: 'SanityImageHotspot'
    width?: number
  }
}

export type SanityImageAssetType = {
  _type?: 'SanityImageAsset'
  _id?: string
  path?: string
  url?: string
  metadata?: {
    _type?: 'SanityImageMetadata'
    dimensions?: {
      _type?: 'SanityImageDimensions'
      height?: number
      width?: number
    }
  }
}
