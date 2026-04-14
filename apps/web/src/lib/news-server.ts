import { createServerFn } from "@tanstack/react-start";
import { client } from "./sanity";
import { serverClient } from "./sanity-server";

const SANITY_TIMEOUT = 8000;

async function fetchWithSanityTimeout<T>(
	query: string,
	params?: Record<string, unknown>,
): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), SANITY_TIMEOUT);

	try {
		const result = await client.fetch<T>(query, params, {
			signal: controller.signal,
		});
		clearTimeout(timeoutId);
		return result;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === "AbortError") {
			console.warn("Sanity API request timed out");
			throw new Error("Sanity request timed out");
		}
		throw error;
	}
}

export const getNews = createServerFn({ method: "GET" })
	.inputValidator(
		(data: { category: string; offset?: number; limit?: number }) => data,
	)
	.handler(async ({ data }) => {
		const { category, offset = 0, limit = 12 } = data;
		const start = offset;
		const end = offset + limit;

		const query =
			category === "all"
				? `*[_type == "news"] | order(publishedAt desc)[$start...$end]{
					_id,
					title,
					publishedAt,
					category,
					image,
					slug,
					body,
					"author": author->{_id, name, slug, image}
				}`
				: `*[_type == "news" && category == $category] | order(publishedAt desc)[$start...$end]{
					_id,
					title,
					publishedAt,
					category,
					image,
					slug,
					body,
					"author": author->{_id, name, slug, image}
				}`;

		const response = await fetchWithSanityTimeout(query, {
			start,
			end,
			...(category !== "all" ? { category } : {}),
		});
		return response || [];
	});

export const getNewsById = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const response = await fetchWithSanityTimeout(
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
		const response = await fetchWithSanityTimeout(
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
		const response = await fetchWithSanityTimeout(
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
		try {
			const response = await fetchWithSanityTimeout(
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
		} catch {
			// Return empty array on error to prevent error boundary trigger
			return [];
		}
	});

export const getNewsByAuthorTotal = createServerFn({ method: "GET" })
	.inputValidator((authorId: string) => authorId)
	.handler(async ({ data: authorId }) => {
		try {
			const response = await fetchWithSanityTimeout(
				`
	      count(*[_type == "news" && references($authorId)])
	    `,
				{ authorId },
			);
			return response;
		} catch {
			// Return 0 on error to prevent error boundary trigger
			return 0;
		}
	});

type CommentInput = {
	newsId: string;
	message: string;
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
	};
};

export const getCommentsForNews = createServerFn({ method: "GET" })
	.inputValidator((newsId: string) => newsId)
	.handler(async ({ data: newsId }) => {
		const response = await fetchWithSanityTimeout(
			`*[_type == "comment" && news._ref == $newsId] 
			 | order(createdAt desc){
				_id,
				name,
				message,
				createdAt
			}`,
			{ newsId },
		);
		return response || [];
	});

export const addCommentToNews = createServerFn({ method: "POST" })
	.inputValidator((data: CommentInput) => {
		if (!data.newsId) throw new Error("newsId is required");
		if (!data.message?.trim()) throw new Error("message is required");
		if (!data.user?.id) throw new Error("user id is required");
		return data;
	})
	.handler(async ({ data }) => {
		if (!process.env.SANITY_WRITE_TOKEN) {
			throw new Error("Sanity write client is not configured");
		}

		const now = new Date().toISOString();
		const doc = await serverClient.create({
			_type: "comment",
			name: data.user.name || "SportsDey user",
			email: data.user.email || undefined,
			userId: data.user.id,
			message: data.message.trim(),
			news: {
				_type: "reference",
				_ref: data.newsId,
			},
			createdAt: now,
		});

		return {
			_id: doc._id,
			name: data.user.name || "SportsDey user",
			message: data.message.trim(),
			createdAt: now,
		};
	});
