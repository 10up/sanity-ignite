import { SeoType } from '@/types/seo'
import { Metadata } from 'next'

export const formatSeoMetadata = (seo: SeoType | null): Metadata => {
  if (!seo) {
    return {}
  }

  return {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
    keywords: seo?.seoKeywords,
    ...(seo.openGraph ? seo.openGraph : {}),
    ...(seo.twitter ? seo.twitter : {}),
    robots: {
      follow: !seo?.nofollowAttributes,
    }
  }
}
