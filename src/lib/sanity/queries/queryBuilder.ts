import { client } from "../client/client";
import { createGroqBuilder, makeSafeQueryRunner } from 'groqd';
import { AllSanitySchemaTypes, internalGroqTypeReferenceTo } from '../../../../.sanity/sanity.types';
import { sanityFetch } from "../client/live";

// 👇 Create a type-safe query runner
export const runQuery = makeSafeQueryRunner((query) => client.fetch(query));

// 👇 Create a type-safe query builder
type SchemaConfig = {
	schemaTypes: AllSanitySchemaTypes
	referenceSymbol: typeof internalGroqTypeReferenceTo;
};

export const q = createGroqBuilder<SchemaConfig>({});

type extraParams = Omit<Parameters<typeof sanityFetch>[0], 'query' | 'params'>;

export const typedSanityFetch = makeSafeQueryRunner<extraParams>(async (query, options) => {
	const { data } = await sanityFetch({
		query,
		...options,
		params: options.parameters,
	});
	return data;
});