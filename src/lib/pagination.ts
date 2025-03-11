export type ParsedPaginationParams = {
	page: number
}

export type ParsedDocumentParams = {
	slug: string,
}

export type ParsedUrlParams = ParsedPaginationParams | ParsedDocumentParams

export const parsePaginationUrlParams = (params: string[] | undefined): ParsedPaginationParams | null => {
	if (!params) {
		return { page: 1 };
	}

	if (params.length === 1) {
		return null;
	}

	if (params?.length === 2 && params[0] === 'page' && !isNaN(parseInt(params[1]))) {
		return { page: parseInt(params[1]) };
	}

	return null;
}

export const parseUrlParams = (params: string[] | undefined): ParsedUrlParams | null => {
	if (params?.length === 1) {
		return { slug: params[0] };
	}

	return parsePaginationUrlParams(params);
};

export type PaginatedResult<T extends { results: unknown, total: number }> = {
	_type: 'paginatedResult',
	data: T,
	currentPage: number,
	totalPages: number,
}

export const paginatedData = <T extends { results: unknown, total: number }>(data: T, page: number, perPage: number): PaginatedResult<T> => {
	const totalPages = Math.ceil(data.total / perPage);

	return {
		_type: 'paginatedResult',
		data,
		currentPage: page,
		totalPages,
	};
}