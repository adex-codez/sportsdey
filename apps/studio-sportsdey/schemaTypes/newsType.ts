import { defineField, defineType } from "sanity";

export const newsType = defineType({
	name: "news",
	title: "News",
	type: "document",
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: { source: "title" },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "sport",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "author",
			type: "reference",
			to: [{ type: "author" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "image",
			type: "image",
		}),
		defineField({
			name: "body",
			type: "array",
			of: [{ type: "block" }],
		}),
	],
});
