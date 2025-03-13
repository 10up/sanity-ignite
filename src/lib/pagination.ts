export type PaginatedResult<T extends { results: unknown; total: number }> = {
  _type: 'paginatedResult';
  data: T;
  currentPage: number;
  totalPages: number;
};

export const paginatedData = <T extends { results: unknown; total: number }>(
  data: T,
  page: number,
  perPage: number,
): PaginatedResult<T> => {
  const totalPages = Math.ceil(data.total / perPage);

  return {
    _type: 'paginatedResult',
    data,
    currentPage: page,
    totalPages,
  };
};
