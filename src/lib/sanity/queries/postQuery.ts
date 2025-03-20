import { postFragment } from "./fragments/PostFragment";
import { q } from "./queryBuilder";

export const top10ProductsQuery = (
	q.star
		.filterByType("post")
		.order("_updatedAt asc")
		.slice(0, 10)
		.project(() => ({
			...postFragment
		}))
);

export const postBySlug = (
	q.star
		.parameters<{ slug: string }>()
		.filterByType("post")
		.filterBy("slug.current == $slug")
		.slice(0)
		.project(() => ({
			...postFragment
		}))
);