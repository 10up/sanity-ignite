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

export const formatMetaData = (seo: SeoType): Metadata => {
  const metaImage = parseImage(seo.metaImage);

  return {
    title: seo?.metaTitle,
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
        title: seo.openGraph.title ?? undefined,
        description: seo.openGraph.description ?? undefined,
        siteName: seo.openGraph.siteName ?? undefined,
        url: seo.openGraph.url ?? undefined,
        images: seo.openGraph.image ? parseImage(seo.openGraph.image) : metaImage,
      }
      : undefined,
    twitter: seo?.twitter ? {
      site: seo.twitter.site || undefined,
      description: seo.openGraph?.description || seo.metaDescription || undefined,
      title: seo.openGraph?.title || seo.metaTitle || undefined,
      images: metaImage
    } : undefined,
    other: parseAdditionalMetaTags(seo?.additionalMetaTags),
  };
};
