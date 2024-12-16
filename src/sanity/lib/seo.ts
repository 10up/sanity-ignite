import { SeoType } from '@/types/seo'

export const formatMetaData = (seo: SeoType) => {
  return {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
    keywords: seo?.seoKeywords,
    nofollow: seo?.nofollowAttributes,
    openGraph: seo?.openGraph,
    twitter: seo?.twitter,
    additionalMetaTags: seo?.additionalMetaTags,
  }
}
