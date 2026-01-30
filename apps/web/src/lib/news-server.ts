import { createServerFn } from "@tanstack/react-start";
import { client } from "./sanity";

export const getNews = createServerFn({ method: "GET" })
	.inputValidator((sport: string) => sport)
	.handler(async ({ data: category }) => {
		const query =
			category === "all"
				? `*[_type == "news"] | order(publishedAt desc){
					_id,
					title,
					publishedAt,
					category,
					image,
					slug,
					body,
					"author": author->{_id, name, slug, image}
				}`
				: `*[_type == "news" && category == $category] | order(publishedAt desc){
					_id,
					title,
					publishedAt,
					category,
					image,
					slug,
					body,
					"author": author->{_id, name, slug, image}
				}`;

		const response = await client.fetch(
			query,
			category === "all" ? {} : { category },
		);

		return response;
	});

export const getNewsById = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const response = await client.fetch(
			`
      *[_type == "news" && _id == $id][0]{
        _id,
        title,
        publishedAt,
        image,
        slug,
        body,
        "author": author->{_id, name, slug, image}
      }
    `,
			{ id },
		);
		return response;
	});

export const getNewsBySlug = createServerFn({ method: "GET" })
	.inputValidator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const response = await client.fetch(
			`
      *[_type == "news" && slug.current == $slug][0]{
        _id,
        title,
        publishedAt,
        image,
        slug,
        body,
        "author": author->{_id, name, slug, image}
      }
    `,
			{ slug },
		);
		return response;
	});

export const getAuthorBySlug = createServerFn({ method: "GET" })
	.inputValidator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const response = await client.fetch(
			`
      *[_type == "author" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        image,
        bio,
        facebook,
        x,
        linkedin
      }
    `,
			{ slug },
		);
		return response;
	});

export const getNewsByAuthor = createServerFn({ method: "GET" })
	.inputValidator(
		(data: { authorId: string; limit?: number; offset?: number }) => {
			if (!data.authorId) throw new Error("authorId is required");
			return data;
		},
	)
	.handler(async ({ data }) => {
		const { authorId, limit = 10, offset = 0 } = data;
		const response = await client.fetch(
			`
      *[_type == "news" && references($authorId)] | order(publishedAt desc) [$offset...$end] {
        _id,
        title,
        publishedAt,
        image,
        slug,
        body,
        sport
      }
    `,
			{ authorId, offset, end: offset + limit },
		);
		return response;
	});

export const getNewsByAuthorTotal = createServerFn({ method: "GET" })
	.inputValidator((authorId: string) => authorId)
	.handler(async ({ data: authorId }) => {
		const response = await client.fetch(
			`
      count(*[_type == "news" && references($authorId)])
    `,
			{ authorId },
		);
		return response;
	});
