import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { formatMetaData } from '@/sanity/lib/seo'
import { SeoType } from '@/types/seo'
import { Page as PageType } from '@/sanity.types'
import PageRenderer from '@/components/Page'
import { getPageQuery } from '@/sanity/lib/queries'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
  })

  if (!page?.seo) {
    return {}
  }

  return formatMetaData(page.seo as unknown as SeoType)
}

export default async function Page(props: Props) {
  const params = await props.params

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
  })

  return <PageRenderer page={page as unknown as PageType} />
}
