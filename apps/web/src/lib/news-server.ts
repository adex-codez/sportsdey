import { createServerFn } from "@tanstack/react-start";
import { client } from "./sanity";

export const getNews = createServerFn({ method: "GET" })
  .inputValidator((sport: string) => sport)
  .handler(async ({ data: sport }) => {
    const response = await client.fetch(
      `
      *[_type == "news" && sport == $sport]{
        _id,
        title,
        publishedAt,
        sport,
        image,
        slug,
        body
      }
      `,
      { sport }
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
		console.log(response);
		return response;
	});
