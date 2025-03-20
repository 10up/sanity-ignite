import { q } from "../queryBuilder";
import { InferFragmentType } from "groqd";
import { personFragment } from "./PersonFragment";

export const postFragment = q.fragmentForType<"post">().project(sub => ({
	_type: true,
	_id: sub.field("_id"),
	slug: "slug.current",
	_createdAt: true,
	_updatedAt: true,
	"title": sub.coalesce('title', q.value("Untitled")),
	excerpt: true,
	"date": sub.coalesce('date', '_updatedAt'),
	"status": sub.select({
		'_originalId in path("drafts.** ")': q.value("draft"),
	}, q.value("published")),
	author: sub.field("author").deref().project(personFragment),
	content: sub.field("content[]").project(sub => ({
		'...': true,
		// ...sub.conditional({
		// 	'_type == "block"': {
		// 		'...': true,
		// 		'markDefs': sub.project({
		// 			'...': true,
		// 			''
		// 		})
		// 	}
		// }),
		// ...sub.filterByType({
		// 	'block': {
		// 		'...': true,
		// 		'markDefs': sub.project({
		// 			'...': true,
		// 			''
		// 		})
		// 	}
		// }),
	}))
}))

export type PostFragmentType = InferFragmentType<typeof postFragment>;