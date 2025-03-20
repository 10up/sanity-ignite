import Link from 'next/link';
import { PersonFragmentType } from '@/lib/sanity/queries/fragments/PersonFragment';

export default function Byline({ author }: { author: PersonFragmentType }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-1">By </div>
        <div className="flex flex-col">
          {author?.firstName && author?.lastName && author?.slug ? (
            <Link
              className="font-bold underline hover:text-gray-700 transition-colors"
              href={`/author/${author.slug}`}
            >
              {author.firstName} {author.lastName}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
