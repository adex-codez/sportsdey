import { createServerFn } from "@tanstack/react-start";
import { client } from "./sanity";

export const getNews = createServerFn({ method: "GET" })
	.inputValidator((sport: string) => sport)
	.handler(async ({ data: sport }) => {
		const response = await client.fetch(
			`
      *[_type == "news" && sport == $sport] | order(publishedAt desc){
        _id,
        title,
        publishedAt,
        sport,
        image,
        slug,
        body
      }
      `,
			{ sport },
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
        body
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
        body
      }
    `,
			{ slug },
		);
		return response;
	});
