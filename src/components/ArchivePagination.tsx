import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type ArchivePaginationProps = {
  totalPages: number;
  currentPage: number;
  linkBase: string;
  itemsToShow?: number;
};

function generatePaginationItems(
  currentPage: number,
  totalPages: number,
  pagesToShow: number,
): number[] {
  if (totalPages <= 0 || pagesToShow <= 0) return [];

  const pagination: Set<number> = new Set();

  const sidePages = Math.floor(pagesToShow / 2);
  let startPage = Math.max(1, currentPage - sidePages);
  let endPage = Math.min(totalPages, currentPage + sidePages);

  // Adjust if not enough pages are added
  while (endPage - startPage + 1 < pagesToShow) {
    if (startPage > 1) startPage--;
    else if (endPage < totalPages) endPage++;
    else break;
  }

  // Add calculated range of pages
  for (let i = startPage; i <= endPage; i++) {
    pagination.add(i);
  }

  return Array.from(pagination).sort((a, b) => a - b);
}

const pageLink = (page: number, linkBase: string) => {
  if (page === 1) {
    return linkBase;
  }
  return `${linkBase}/page/${page}`;
};

export function ArchivePagination({
  totalPages,
  currentPage,
  linkBase,
  itemsToShow = 5,
}: ArchivePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const pages = generatePaginationItems(currentPage, totalPages, itemsToShow);

  return (
    <Pagination>
      <PaginationContent>
        {previousPage && (
          <PaginationItem>
            <PaginationPrevious href={pageLink(previousPage, linkBase)} />
          </PaginationItem>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={pageLink(page, linkBase)} isActive={currentPage === page}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {nextPage && (
          <PaginationItem>
            <PaginationNext href={pageLink(nextPage, linkBase)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
