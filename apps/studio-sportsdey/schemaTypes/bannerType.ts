import { defineField, defineType } from "sanity";

export const bannerType = defineType({
	name: "banner",
	title: "Banner",
	type: "document",
	fields: [
		defineField({
			name: "image",
			title: "Banner Image",
			type: "image",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					title: "Alt Text",
					type: "string",
					options: {
						isHighlighted: true,
					},
				},
			],
		}),
		defineField({
			name: "url",
			title: "Link URL",
			type: "url",
			validation: (rule) =>
				rule.uri({
					scheme: ["http", "https"],
				}),
		}),
	],
});
