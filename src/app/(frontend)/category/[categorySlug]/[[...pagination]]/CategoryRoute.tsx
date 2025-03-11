import { ArchivePagination } from '@/components/ArchivePagination';
import { getDocumentLink } from '@/lib/links';
import { PaginatedResult } from '@/lib/pagination';
import { CategoryQueryResult, PostsArchiveQueryResult } from '@/sanity.types';
import React from 'react';

type Props = {
  category: CategoryQueryResult;
  listingData?: PaginatedResult<PostsArchiveQueryResult>;
};

const CategoryRoute = ({ category, listingData }: Props) => {
  const { data, currentPage = 1, totalPages = 1 } = listingData || {};

  return (
    <main className="container mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold mb-6">
        {category?.title}
        {currentPage > 1 && ` - Page ${currentPage}`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data &&
          data.results.map((post) => {
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

export default CategoryRoute;
