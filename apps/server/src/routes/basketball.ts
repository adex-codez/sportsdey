import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
	ErrorResponseSchema,
	GameSummarySchema,
	GameTeamStatsSchema,
	ScheduleData,
	StandingsSchema,
	VideoResponseSchema,
	successResponseSchema,
} from "@/schemas";

import {
	transformGameSummary,
	transformGameTeamStats,
	transformProxySchedule,
	transformProxyStandings,
} from "@/utils/basketball";
import { jsonZodErrorFormatter } from "@/utils/zod";
import {
	basketballScheduleParam,
	basketballScheduleQuery,
	basketballStandingsParam,
	basketballVideosQuery,
	gameIdParam,
} from "@/validators";

const basketballRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

// Enhanced date validation that checks if the date actually exists

// Schemas for the game summary

// Game ID parameter validator

// Create the route with proper parameter names that match the path
const basketballScheduleRoute = createRoute({
	method: "get",
	path: "/schedule",
	summary: "Get NBA schedule for a specific date",
	description:
		"Retrieves NBA games scheduled for the specified date. Poll on the client for 5s to get near realtime updates about the schedules",
	request: {
		params: basketballScheduleParam,
		query: basketballScheduleQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(ScheduleData),
				},
			},
			description: "Successfully retrieved basketball games",
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
	tags: ["Basketball"],
});

basketballRoute.openapi(
	basketballScheduleRoute,
	async (c) => {
		try {
			const { date } = c.req.valid("query");

			const proxyUrl = c.env.PROXY_URL;
			const proxySecret = c.env.PROXY_SECRET;

			if (!proxyUrl || !proxySecret) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "server",
								message: "Proxy configuration missing",
								code: "config_error",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_schedule_${date}`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
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

			const apiUrl = `${proxyUrl}basketball/match/list?date=${date}`;

			const response = await fetch(apiUrl, {
				headers: {
					"X-Proxy-Auth": proxySecret,
				},
			});

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Proxy API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = await response.json();
			const transformedData = transformProxySchedule(data as any[]);

			await c.env.sportsdey_ns.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt: Date.now() + 30 * 1000,
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
			console.error(error);
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

const basketballStandingsRoute = createRoute({
	method: "get",
	path: "/standings/{tournamentId}",
	summary: "Get Standings for a tournament",
	description: "Retrieves standings for a specific tournament.",
	request: {
		params: basketballStandingsParam,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(StandingsSchema),
				},
			},
			description: "Successfully retrieved standings",
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
	tags: ["Basketball"],
});

basketballRoute.openapi(
	basketballStandingsRoute,
	async (c) => {
		try {
			const { tournamentId } = c.req.valid("param");
			const proxyUrl = c.env.PROXY_URL;
			const proxySecret = c.env.PROXY_SECRET;

			if (!proxyUrl || !proxySecret) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "server",
								message: "Proxy configuration missing",
								code: "config_error",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_standings_${tournamentId}`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
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

			const apiUrl = `${proxyUrl}basketball/tournament/standings?tournamentId=${tournamentId}`;

			const response = await fetch(apiUrl, {
				headers: {
					"X-Proxy-Auth": proxySecret,
				},
			});

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Proxy API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = await response.json();
			const transformedData = transformProxyStandings(data as any[]);

			await c.env.sportsdey_ns.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt: Date.now() + 60 * 60 * 1000, // Cache for 1 hour
				}),
			);

			return c.json({ success: true as const, data: transformedData }, 200);
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

const basketballGameSummaryRoute = createRoute({
	method: "get",
	path: "/game/{gameId}",
	summary: "Get NBA game details with player statistics",
	description:
		"Retrieves detailed information about a specific NBA game including player statistics. If the game status is closed poll the server from the client every 2 min but if it isn't closed poll every 2 seconds",
	request: {
		params: gameIdParam,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(GameSummarySchema),
				},
			},
			description: "Successfully retrieved game details",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad request - invalid game ID",
		},
		404: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Game not found",
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
	tags: ["Basketball"],
});

basketballRoute.openapi(
	basketballGameSummaryRoute,
	async (c) => {
		try {
			const { gameId } = c.req.valid("param");
			const proxyUrl = c.env.PROXY_URL;
			const proxySecret = c.env.PROXY_SECRET;

			if (!proxyUrl || !proxySecret) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "server",
								message: "Proxy configuration missing",
								code: "config_error",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_game_${gameId}`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
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

			// Parallel fetch for summary and boxscore
			const [summaryRes, boxscoreRes] = await Promise.all([
				fetch(`${proxyUrl}basketball/match/summary?matchId=${gameId}`, {
					headers: { "X-Proxy-Auth": proxySecret },
				}),
				fetch(`${proxyUrl}basketball/match/boxscore?matchId=${gameId}`, {
					headers: { "X-Proxy-Auth": proxySecret },
				}),
			]);

			if (!summaryRes.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Summary API returned status ${summaryRes.statusText}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			if (!boxscoreRes.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Boxscore API returned status ${boxscoreRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const summaryData = await summaryRes.json();
			const boxscoreData = await boxscoreRes.json();

			const transformedData = transformGameSummary(
				summaryData as any,
				boxscoreData as any,
			);

			// Determine cache time based on status using the transformed status directly or checking summary
			const isClosed =
				transformedData.status === "Full Time" ||
				transformedData.status === "closed";

			await c.env.sportsdey_ns.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt: isClosed
						? Date.now() + 2 * 60 * 1000
						: Date.now() + 2 * 1000,
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
			console.error(error);
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

const gameTeamStatsRoute = createRoute({
	method: "get",
	path: "/game/{gameId}/stats",
	summary: "Get Team Stats for a nba game.",
	description:
		"It allows you to view the teams stats for both the home and away team for a particular game. poll the server every 5 seconds",
	request: {
		params: gameIdParam,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(GameTeamStatsSchema),
				},
			},
			description: "Successfully retrieved game details",
		},
		400: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Bad request - invalid game ID",
		},
		404: {
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
			description: "Team stats not found",
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
	tags: ["Basketball"],
});

basketballRoute.openapi(
	gameTeamStatsRoute,
	async (c) => {
		try {
			const { gameId } = c.req.valid("param");
			const proxyUrl = c.env.PROXY_URL;
			const proxySecret = c.env.PROXY_SECRET;

			if (!proxyUrl || !proxySecret) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "server",
								message: "Proxy configuration missing",
								code: "config_error",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_game_${gameId}_stats`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
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

			const response = await fetch(
				`${proxyUrl}basketball/match/boxscore?matchId=${gameId}`,
				{
					headers: { "X-Proxy-Auth": proxySecret },
				},
			);

			if (!response.ok) {
				if (response.status === 404) {
					return c.json(
						{
							success: false as const,
							error: "Game not found",
							details: [
								{
									field: "gameId",
									message: `Game with ID ${gameId} was not found`,
									code: "game_not_found",
								},
							],
						},
						404,
					);
				}

				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Proxy API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const boxscoreData = await response.json();
			const transformedData = transformGameTeamStats(boxscoreData as any);

			await c.env.sportsdey_ns.put(
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
	},
	jsonZodErrorFormatter,
);

const basketballVideosRoute = createRoute({
	method: "get",
	path: "/videos",
	summary: "Get YouTube videos for a basketball match",
	description:
		"Retrieves YouTube videos related to a specific basketball match query, ordered by date. If there is only nextPageToken that means that's the first set of videos. If there is only prevPageToken that means that's the last set of videos. If both nextPageToken and prevPageToken are present then there are more videos available. You can pass any of the two to the pageToken query so for pagination",
	request: {
		query: basketballVideosQuery,
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
	tags: ["Basketball"],
});

basketballRoute.openapi(
	basketballVideosRoute,
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

			const cacheKey = `basketball_videos_${query}_${pageToken || "first"}`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
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

			const response = await fetch(apiUrl);

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

			await c.env.sportsdey_ns.put(
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

export default basketballRoute;
