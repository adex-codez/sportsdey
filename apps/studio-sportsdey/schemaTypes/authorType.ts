import { defineField, defineType } from "sanity";

export const authorType = defineType({
	name: "author",
	title: "Author",
	type: "document",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: { source: "name" },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "bio",
			type: "array",
			of: [{ type: "block" }],
		}),
		defineField({
			name: "x",
			type: "url",
			title: "X (Twitter) URL",
			validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
		}),
		defineField({
			name: "linkedin",
			type: "url",
			title: "LinkedIn URL",
			validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
		}),
	],
});
