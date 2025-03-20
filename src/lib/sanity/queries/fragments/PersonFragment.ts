import { q } from "../queryBuilder";
import { InferFragmentType } from "groqd";

export const personFragment = q.fragmentForType<"person">().project(sub => ({
	_type: true,
	_id: sub.field("_id"),
	firstName: true,
	lastName: true,
}))

export type PersonFragmentType = InferFragmentType<typeof personFragment>;