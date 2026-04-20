'use client';

import { useQueryState } from 'nuqs';
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from '@/components/ui/Pagination';
import { blogSearchParams, serializeBlogSearchParams } from './searchParams';

function pageHref(page: number): string {
  return `/blog${serializeBlogSearchParams({ page: page === 1 ? null : page })}`;
}

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const [, setPage] = useQueryState('page', {
    ...blogSearchParams.page,
    shallow: false,
  });

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationRoot className="mt-10">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={pageHref(currentPage - 1)}
              onClick={(e) => {
                e.preventDefault();
                setPage(currentPage - 1 === 1 ? null : currentPage - 1);
              }}
            />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={pageHref(page)}
              isActive={currentPage === page}
              onClick={(e) => {
                e.preventDefault();
                setPage(page === 1 ? null : page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={pageHref(currentPage + 1)}
              onClick={(e) => {
                e.preventDefault();
                setPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
}
