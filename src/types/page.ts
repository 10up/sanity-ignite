import { Cta, Hero, MediaText, PostList } from '@/sanity.types'

export type PageSections = Array<
  | ({
      _key: string
    } & Cta)
  | ({
      _key: string
    } & Hero)
  | ({
      _key: string
    } & MediaText)
  | ({
      _key: string
    } & PostList)
> | null
