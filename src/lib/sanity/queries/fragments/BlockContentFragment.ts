import { q } from "../queryBuilder";
import { InferFragmentType } from "groqd";
import { personFragment } from "./PersonFragment";
import { BlockContent } from "@/sanity.types";

export const blogContentFragment = q.fragment<BlockContent[number]>().project(sub => ({
	_key: true,
	_type: true,
	...sub.conditional({
		"_type == 'image'": {
			alt: true,
		}
	}),
	...sub.conditional({
		"_type == 'block'": {
			markDefs: sub.field("markDefs").project(sub => ({
				'...': true
			})
		}
	})
	// markDefs: sub.field("markDefs").project(sub => ({
	// 	_key: true,
	// 	_type: true,
	// }
}))

export type BlogContentFragmentType = InferFragmentType<typeof blogContentFragment>;