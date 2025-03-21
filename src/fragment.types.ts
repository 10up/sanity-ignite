import { PostQueryResult } from "./sanity.types";

export type PostFragment = NonNullable<PostQueryResult>

export type SeoFragment = NonNullable<PostFragment['seo']>

export type TwitterFragment = NonNullable<SeoFragment['twitter']>