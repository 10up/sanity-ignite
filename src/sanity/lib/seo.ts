import { CustomImageType, MetaTagType, SeoType } from '@/types/seo';
import { Metadata } from 'next';

type ImageDescriptor =
  | string
  | URL
  | undefined
  | {
      url: string | URL;
      alt?: string | undefined;
      secureUrl?: string | URL | undefined;
      type?: string | undefined;
      width?: string | number | undefined;
      height?: string | number | undefined;
    };

function parseImage(image: CustomImageType | undefined): ImageDescriptor {
  if (!image?.asset?.url) {
    return undefined;
  }

  return {
    url: image.asset.url,
    width: image.asset?.metadata?.dimensions?.width,
    height: image.asset?.metadata?.dimensions?.height,
  };
}

function parseAdditionalMetaTags(additionalMetaTags: MetaTagType[] | undefined) {
  if (!additionalMetaTags) {
    return undefined;
  }

  const otherTags: Record<string, string> = {};
  additionalMetaTags.forEach((metaTag) => {
    metaTag?.metaAttributes?.forEach((metaAttribute) => {
      if (metaAttribute?.attributeKey) {
        if (metaAttribute?.attributeType === 'string' && metaAttribute?.attributeValueString) {
          otherTags[metaAttribute.attributeKey] = metaAttribute.attributeValueString;
        }

        if (
          metaAttribute?.attributeType === 'image' &&
          metaAttribute?.attributeValueImage?.asset?.url
        ) {
          otherTags[metaAttribute.attributeKey] = metaAttribute.attributeValueImage.asset.url;
        }
      }
    });
  });

  return otherTags;
}

export const formatMetaData = (seo: SeoType, defaultTitle: string): Metadata => {
  const metaImage = parseImage(seo.metaImage);

  return {
    title: seo?.metaTitle ?? defaultTitle,
    description: seo?.metaDescription,
    keywords: seo?.seoKeywords,
    robots: seo?.noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: seo?.openGraph
      ? {
          ...seo.openGraph,
          images: parseImage(seo.openGraph.image) ?? metaImage,
        }
      : undefined,
    twitter: seo?.twitter ? { ...seo.twitter, images: metaImage } : undefined,
    other: parseAdditionalMetaTags(seo?.additionalMetaTags),
  };
};
