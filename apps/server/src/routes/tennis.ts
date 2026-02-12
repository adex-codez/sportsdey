import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
	ErrorResponseSchema,
	successResponseSchema,
	TennisMatchInfoData,
	TennisScheduleData,
	VideoResponseSchema,
} from "@/schemas";
import type {
	SportRadarTennisGameResponse,
	SportRadarTennisResponse,
} from "@/types";
import { fetchWithTimeout, isTimeoutError } from "@/utils/fetch-with-timeout";
import { transformTennisData, transformTennisMatchData } from "@/utils/tennis";
import { jsonZodErrorFormatter } from "@/utils/zod";
import {
	tennisGameIdParam,
	tennisScheduleParam,
	tennisScheduleQuery,
	tennisVideosQuery,
} from "@/validators";

const tennisRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

const tennisScheduleRoute = createRoute({
	method: "get",
	path: "/schedule/{date}",
	summary: "Get tennis schedule for a specific date",
	description:
		"Retrieves tennis matches scheduled for the specified date, grouped by competition with set-by-set scores for each team. Poll the server every 5 min to get near real time update",
	request: {
		params: tennisScheduleParam,
		query: tennisScheduleQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(TennisScheduleData),
				},
			},
			description: "Successfully retrieved tennis schedule",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad request - invalid date or parameters",
		},
		500: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Internal server error",
		},
		502: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad gateway - external API error",
		},
	},
	tags: ["Tennis"],
});

tennisRoute.openapi(
	tennisScheduleRoute,
	async (c) => {
		try {
			const { date } = c.req.valid("param");
			const { language } = c.req.valid("query");

			const apiKey = c.env?.SPORTRADAR_API_KEY;
			const cacheKey = `tennis_schedule_${date}_${language}`;

			const cachedData = (await c.env.sportsdey_ns?.get(cacheKey, "json")) as {
				data: any;
				expiresAt: number;
			} | null;

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiUrl = `https://api.sportradar.com/tennis/trial/v3/${language}/schedules/${date}/summaries.json?api_key=${apiKey}`;

			let response: Response;
			try {
				response = await fetchWithTimeout(apiUrl, {}, 10000);
			} catch (err) {
				if (isTimeoutError(err)) {
					return c.json(
						{
							success: false as const,
							error: "Gateway timeout",
							details: [
								{
									field: "sportradar_api",
									message: "SportRadar API request timed out",
									code: "timeout_error",
								},
							],
						},
						502,
					);
				}
				throw err;
			}

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "sportradar_api",
								message: `SportRadar API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const apiData: SportRadarTennisResponse = await response.json();
			const transformedData = transformTennisData(apiData, date);

			await c.env.sportsdey_ns?.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt: Date.now() + 5 * 60 * 1000,
				}),
			);

			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (error) {
			console.error("Error fetching tennis schedule:", error);
			return c.json(
				{
					success: false as const,
					error: "Internal server error",
					details: [
						{
							field: "server",
							message:
								"An unexpected error occurred while processing your request",
							code: "internal_error",
						},
					],
				},
				500,
			);
		}
	},
	jsonZodErrorFormatter,
);

const tennisGameRoute = createRoute({
	method: "get",
	path: "/game/{gameId}",
	summary: "Get tennis game info",
	description:
		"Retrieves tennis matche info. Poll the server every 5 seconds min to get near real time update",
	request: {
		params: tennisGameIdParam,
		query: tennisScheduleQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(TennisMatchInfoData),
				},
			},
			description: "Successfully retrieved tennis schedule",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad request - invalid date or parameters",
		},
		500: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Internal server error",
		},
		502: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad gateway - external API error",
		},
	},
	tags: ["Tennis"],
});

tennisRoute.openapi(tennisGameRoute, async (c) => {
	try {
		const { gameId } = c.req.valid("param");
		const { language } = c.req.valid("query");

		const apiKey = c.env?.SPORTRADAR_API_KEY;
		const cacheKey = `tennis_match_${gameId}`;

		const cachedData = (await c.env.sportsdey_ns?.get(cacheKey, "json")) as {
			data: any;
			expiresAt: number;
		} | null;

		if (cachedData && Date.now() <= cachedData.expiresAt) {
			return c.json(
				{
					success: true as const,
					data: cachedData.data,
				},
				200,
			);
		}

		const apiUrl = `https://api.sportradar.com/tennis/trial/v3/${language}/sport_events/${encodeURIComponent(gameId)}/summary.json?api_key=${apiKey}`;

		let response: Response;
		try {
			response = await fetchWithTimeout(apiUrl, {}, 10000);
		} catch (err) {
			if (isTimeoutError(err)) {
				return c.json(
					{
						success: false as const,
						error: "Gateway timeout",
						details: [
							{
								field: "sportradar_api",
								message: "SportRadar API request timed out",
								code: "timeout_error",
							},
						],
					},
					502,
				);
			}
			throw err;
		}

		if (!response.ok) {
			return c.json(
				{
					success: false as const,
					error: "External API error",
					details: [
						{
							field: "sportradar_api",
							message: `SportRadar API returned status ${response.status}`,
							code: "external_api_error",
						},
					],
				},
				502,
			);
		}

		const apiData: SportRadarTennisGameResponse = await response.json();
		const transformedData = transformTennisMatchData(apiData);

		await c.env.sportsdey_ns?.put(
			cacheKey,
			JSON.stringify({
				data: transformedData,
				expiresAt: Date.now() + 5 * 1000,
			}),
		);

		return c.json(
			{
				success: true as const,
				data: transformedData,
			},
			200,
		);
	} catch (error) {
		return c.json(
			{
				success: false as const,
				error: "Internal server error",
				details: [
					{
						field: "server",
						message:
							"An unexpected error occurred while processing your request",
						code: "internal_error",
					},
				],
			},
			500,
		);
	}
});

const tennisVideosRoute = createRoute({
	method: "get",
	path: "/videos",
	summary: "Get YouTube videos for a tennis match",
	description:
		"Retrieves YouTube videos related to a specific tennis match query, ordered by date.If there is only nextPageToken that means that's the first set of videos. If there is only prevPageToken that means that's the last set of videos. If both nextPageToken and prevPageToken are present then there are more videos available. You can pass any of the two to the pageToken query so for pagination",
	request: {
		query: tennisVideosQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(VideoResponseSchema),
				},
			},
			description: "Successfully retrieved videos",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad request",
		},
		500: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Internal server error",
		},
		502: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "External API error",
		},
	},
	tags: ["Tennis"],
});

tennisRoute.openapi(
	tennisVideosRoute,
	async (c) => {
		try {
			const { query, pageToken } = c.req.valid("query");
			const apiKey = c.env?.YOUTUBE_API_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "YOUTUBE_API_KEY",
								message: "YouTube API key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `tennis_videos_${query}_${pageToken || "first"}`;
			const cachedData = (await c.env.sportsdey_ns?.get(cacheKey, "json")) as {
				data: any;
				expiresAt: number;
			} | null;

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&order=date&key=${apiKey}&maxResults=10`;
			if (pageToken) {
				apiUrl += `&pageToken=${pageToken}`;
			}

			let response: Response;
			try {
				response = await fetchWithTimeout(apiUrl, {}, 10000);
			} catch (err) {
				if (isTimeoutError(err)) {
					return c.json(
						{
							success: false as const,
							error: "Gateway timeout",
							details: [
								{
									field: "youtube_api",
									message: "YouTube API request timed out",
									code: "timeout_error",
								},
							],
						},
						502,
					);
				}
				throw err;
			}

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "youtube_api",
								message: `YouTube API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data: any = await response.json();
			const transformedData = {
				nextPageToken: data.nextPageToken,
				prevPageToken: data.prevPageToken,
				videos: data.items.map((item: any) => ({
					videoId: item.id.videoId,
					publishedAt: item.snippet.publishedAt,
					title: item.snippet.title,
				})),
			};

			await c.env.sportsdey_ns?.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt: Date.now() + 10 * 60 * 1000, // Cache for 10 minutes
				}),
			);

			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (error) {
			return c.json(
				{
					success: false as const,
					error: "Internal server error",
					details: [
						{
							field: "server",
							message:
								"An unexpected error occurred while processing your request",
							code: "internal_error",
						},
					],
				},
				500,
			);
		}
	},
	jsonZodErrorFormatter,
);

export default tennisRoute;
