export type ParsedUrlParams = {
	slug: string,
} | {
	page: number,
};

export const parseUrlParams = (params: string[] | undefined): ParsedUrlParams | null => {
	if (!params) {
		return { page: 1 };
	}

	if (params.length === 1) {
		return { slug: params[0] };
	}

	if (params.length === 2 && params[0] === 'page' && !isNaN(parseInt(params[1]))) {
		return { page: parseInt(params[1]) };
	}

	return null;
};