import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
	ErrorResponseSchema,
	GameSummarySchema,
	GameTeamStatsSchema,
	ScheduleData,
	StandingsSchema,
	VideoResponseSchema,
	successResponseSchema,
} from "@/schemas";
import type {
	SportRadarGameSummary,
	SportRadarStandingsConference,
	SportRadarStandingsResponse,
	SportRadarStandingsTeam,
} from "@/types";
import { transformTeamData } from "@/utils/basketball";
import { jsonZodErrorFormatter } from "@/utils/zod";
import {
	basketballScheduleParam,
	basketballScheduleQuery,
	basketballStandingsParam,
	basketballStandingsQuery,
	basketballVideosQuery,
	gameIdParam,
} from "@/validators";
import { transform } from "zod";

const basketballRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

// Enhanced date validation that checks if the date actually exists
const validateActualDate = (year: number, month: number, day: number) => {
	const date = new Date(year, month - 1, day);
	return (
		date.getFullYear() === year &&
		date.getMonth() === month - 1 &&
		date.getDate() === day
	);
};

interface SportRadarGame {
	id: string;
	status: string;
	scheduled: string
	home_points?: number;
	away_points?: number;
	home: {
		name: string;
		alias: string;
	};
	away: {
		name: string;
		alias: string;
	};
}

interface SportRadarResponse {
	league: {
		name: string;
	};
	games: SportRadarGame[];
}

// Schemas for the game summary

// Game ID parameter validator

// Create the route with proper parameter names that match the path
const basketballScheduleRoute = createRoute({
	method: "get",
	path: "/schedule/{year}/{month}/{day}",
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
			const { year, month, day } = c.req.valid("param");
			const { language } = c.req.valid("query");

			if (!validateActualDate(year, month, day)) {
				return c.json(
					{
						success: false as const,
						error: "Invalid date",
						details: [
							{
								field: "date",
								message: `The date ${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} does not exist`,
								code: "invalid_date",
							},
						],
					},
					400,
				);
			}

			const apiKey = c.env?.SPORTRADAR_API_KEY;
			const cacheKey = `basketball_schedule_${language}_${year}_${month}_${day}`;
			const cachedData = (await c.env.sportsdey_ns.get(
				cacheKey,
				"json",
			)) as {
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

			const paddedMonth = month.toString().padStart(2, "0");
			const paddedDay = day.toString().padStart(2, "0");

			const apiUrl = `https://api.sportradar.com/nba/trial/v8/${language}/games/${year}/${paddedMonth}/${paddedDay}/schedule.json?api_key=${apiKey}`;

			const response = await fetch(apiUrl);

			if (!response.ok) {
				// if (response.status === 401) {
				// 	return c.json(
				// 		{
				// 			success: false as const,
				// 			error: "Authentication failed",
				// 			details: [
				// 				{
				// 					field: "api_key",
				// 					message: "Invalid or expired SportRadar API key",
				// 					code: "auth_failed",
				// 				},
				// 			],
				// 		},
				// 		401,
				// 	);
				// }
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

			const data: SportRadarResponse = await response.json();
			const transformedData = {
				league: data.league.name,
				games: data.games.map((game) => ({
					id: game.id,
					status: game.status,
					scheduledTime: game.scheduled,
					home: {
						name: game.home.name,
						alias: game.home.alias,
						points: game.home_points ?? null,
					},
					away: {
						name: game.away.name,
						alias: game.away.alias,
						points: game.away_points ?? null,
					},
				})),
			};

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
	path: "/standings/{season}",
	summary: "Get NBA standings for a season and type",
	description: "Retrieves NBA standings, filtered by conference and paginated.",
	request: {
		params: basketballStandingsParam,
		query: basketballStandingsQuery,
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
			const { season } = c.req.valid("param");
			const { conference, limit, offset } = c.req.valid("query");
			const cacheKey = `basketball_standings_${season}_REG`;
			const cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
				data: SportRadarStandingsResponse;
				expiresAt: number;
			} | null;

			let standingsData: SportRadarStandingsResponse;
			if (cachedData && Date.now() <= cachedData.expiresAt) {
				standingsData = cachedData.data;
			} else {
				const apiKey = c.env?.SPORTRADAR_API_KEY;
				const apiUrl = `https://api.sportradar.com/nba/trial/v8/en/seasons/${season}/REG/standings.json?api_key=${apiKey}`;
				const response = await fetch(apiUrl);
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
				standingsData = (await response.json()) as SportRadarStandingsResponse;
				// await c.env.sportsdey_ns.put(
				// 	cacheKey,
				// 	JSON.stringify({
				// 		data: standingsData,
				// 		expiresAt: Date.now() + 2 * 60 * 1000,
				// 	}),
				// );
			}

			// Filter by conference (ignore divisions)
			const conferenceData = (standingsData.conferences || []).filter(
				(conf: SportRadarStandingsConference) =>
					conf.name ===
					(conference === "eastern"
						? "EASTERN CONFERENCE"
						: "WESTERN CONFERENCE"),
			);
			if (!conferenceData) {
				return c.json(
					{
						success: false as const,
						error: "Conference not found",
						details: [
							{
								field: "conference",
								message: `Conference '${conference}' not found in standings data`,
								code: "conference_not_found",
							},
						],
					},
					400,
				);
			}

			const teams = conferenceData[0]?.divisions.flatMap((division) =>
				division.teams.map((team: SportRadarStandingsTeam) => ({
					id: team.id,
					name: `${team.market} ${team.name}`,
					wins: team.wins,
					losses: team.losses,
					played: team.wins + team.losses,
					streak:
						team.streak?.type === "win"
							? team.streak.length
							: team.streak?.type === "loss"
								? -team.streak.length
								: 0,
					gb: team.games_back ?? 0,
					diff: team.point_diff ?? 0,
					win_pct: team.win_pct ?? 0,
				})),
			);

			const paginatedTeams = teams!.slice(offset, offset + limit);

			return c.json({ success: true as const, data: paginatedTeams }, 200);
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

const gameSummaryRoute = createRoute({
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
	gameSummaryRoute,
	async (c) => {
		try {
			const { gameId } = c.req.valid("param");
			const apiKey = c.env?.SPORTRADAR_API_KEY;

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

			// Fetch from SportRadar API
			const apiUrl = `https://api.sportradar.com/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${apiKey}`;
			const response = await fetch(apiUrl);

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
								field: "sportradar_api",
								message: `SportRadar API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const gameData: SportRadarGameSummary = await response.json();

			const transformedData = {
				id: gameData.id,
				status: gameData.status,
				...(gameData.scheduled ? {scheduledTime: gameData.scheduled} : {}),
				season: gameData.season,
				clock: gameData.clock,
				quarter: gameData.quarter,
				venue: {
					id: gameData.venue.id,
					name: gameData.venue.name,
				},
				home: {
					...(gameData.home.scoring?.length === 0 ? {} :
						{score: gameData.home.scoring?.map((score) => ({
							quarter: score.number,
							points: score.points,
						}))}
					),
					...transformTeamData(gameData.home, false, gameData.status === "scheduled" ? true : false),
				},
				away: {
					 ...(gameData.home.scoring?.length === 0 ? {} :
						{score:gameData.home.scoring?.map((score) => ({
							quarter: score.number,
							points: score.points,
						}))}),
					...transformTeamData(gameData.away, false,gameData.status === "scheduled" ? true : false),
				},
			};

			console.log(transformedData)

			await c.env.sportsdey_ns.put(
				cacheKey,
				JSON.stringify({
					data: transformedData,
					expiresAt:
						transformedData.status === "closed"
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
			const apiKey = c.env?.SPORTRADAR_API_KEY;

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

			// Fetch from SportRadar API
			const apiUrl = `https://api.sportradar.com/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${apiKey}`;
			const response = await fetch(apiUrl);

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
								field: "sportradar_api",
								message: `SportRadar API returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const gameData: SportRadarGameSummary = await response.json();

			const transformedData = {
				home: {
					...transformTeamData(gameData.home, true, gameData.status === "scheduled" ? true : false),
				},
				away: {
					...transformTeamData(gameData.away, true,gameData.status === "scheduled" ? true : false),
				},
			};

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
