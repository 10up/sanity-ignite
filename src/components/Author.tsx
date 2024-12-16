import { Person } from '@/sanity.types'

export default function Author({ author }: { author: Person }) {
  return (
    <div>
      {author.firstName} {author.lastName}
    </div>
  )
}
