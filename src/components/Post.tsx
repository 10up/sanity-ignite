import { Person, Post as PostType } from '@/sanity.types'
import Link from 'next/link'
import Date from './Date'
import Author from './Author'

export default function Post({ post }: { post: PostType }) {
  const { _id, title, slug, excerpt, date, author } = post

  return (
    <article
      key={_id}
      className="flex max-w-xl flex-col items-start justify-between border-b-2 mb-8"
    >
      <div className="text-gray-500 text-sm">
        <Date dateString={date} /> &bull; {author !== null && <Author author={author} />}
      </div>

      <h3 className="mt-5 text-2xl font-semibold">
        <Link className="hover:text-red-500 underline transition-colors" href={`/posts/${slug}`}>
          {title}
        </Link>
      </h3>
      <p className="mt-7 line-clamp-3 text-sm leading-6 text-gray-600">{excerpt}</p>
    </article>
  )
}
