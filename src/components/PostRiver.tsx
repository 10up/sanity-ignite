import { ArchivePagination } from '@/components/ArchivePagination';
import { PostsArchiveQueryResult } from '@/sanity.types';
import React from 'react';
import PostCard from './PostCard';

type Props = {
  listingData: NonNullable<PostsArchiveQueryResult>;
  currentPage?: number;
  totalPages?: number;
  title?: string;
  paginationBase?: string;
};

const PostRiver = ({
  listingData,
  currentPage = 1,
  paginationBase = '/blog',
  totalPages = 1,
}: Props) => {
  const { results } = listingData;

  return (
    <>
      <div className="grid grid-cols-1 gap-10">
        {results.map((post) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </div>
      <ArchivePagination
        currentPage={currentPage}
        linkBase={paginationBase}
        totalPages={totalPages}
      />
    </>
  );
};

export default PostRiver;
