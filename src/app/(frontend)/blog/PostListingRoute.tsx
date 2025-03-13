import { ArchivePagination } from '@/components/ArchivePagination';
import { getDocumentLink } from '@/lib/links';
import { PostsArchiveQueryResult } from '@/sanity.types';
import React from 'react';

type Props = {
  listingData: NonNullable<PostsArchiveQueryResult>;
  currentPage?: number;
  totalPages?: number;
};

const PostListingRoute = ({ listingData, currentPage = 1, totalPages = 1 }: Props) => {
  const { results } = listingData;

  return (
    <main className="container mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        Blog
        {currentPage > 1 && ` - Page ${currentPage}`}
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {results.map((post) => {
          return (
            <a href={getDocumentLink(post)} key={post._id}>
              <h3 key={post._id} className="text-2xl font-bold mb-4">
                {post.title}
              </h3>
            </a>
          );
        })}
      </div>
      <ArchivePagination currentPage={currentPage} linkBase="/blog" totalPages={totalPages} />
    </main>
  );
};

export default PostListingRoute;
