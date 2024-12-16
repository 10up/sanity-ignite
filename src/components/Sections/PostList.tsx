import { PostList } from '@/sanity.types'
import Posts from '../Posts'

export default async function PostListSection({ section }: { section: PostList }) {
  return (
    <div className="py-28 container lg:flex lg: align-top lg:justify-center lg:gap-20">
      <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5">
        {section?.heading}
      </h2>
      <Posts />
    </div>
  )
}
