import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
	ErrorResponseSchema,
	successResponseSchema,
	VideoResponseSchema,
} from "@/schemas";
import {
	BasketballTournamentScheduleSchema,
	GameSummarySchema,
	GameTeamStatsSchema,
	ScheduleData,
	StandingsSchema,
} from "@/schemas/basketball";
import {
	transformApiSportsStandings,
	transformGameSummaryApiSports,
	transformGameTeamStats,
	transformSchedule,
} from "@/utils/basketball";
import { fetchWithTimeout, isTimeoutError } from "@/utils/fetch-with-timeout";
import { jsonZodErrorFormatter } from "@/utils/zod";
import {
	basketballScheduleParam,
	basketballScheduleQuery,
	basketballStandingsParam,
	basketballVideosQuery,
	gameIdParam,
} from "@/validators";

const basketballRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

function getKvNamespace(env: any): any {
	return env.sportsdey_ns || env.staging_kv || null;
}

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

			const apiKey = c.env.API_SPORTS_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "API_SPORTS_KEY",
								message: "API-Sports key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_schedule_${date}`;
			let cachedData = null;
			try {
				cachedData = (await getKvNamespace(c.env)?.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiSportsBase = "https://v1.basketball.api-sports.io";
			const [day, month, year] = date.split("/");
			const apiSportsDate = `${year}-${month}-${day}`;
			const apiUrl = `${apiSportsBase}/games?date=${apiSportsDate}`;

			let response: Response;
			try {
				response = await fetchWithTimeout(
					apiUrl,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey!,
							Accept: "application/json",
						},
					},
					10000,
				);
			} catch (err) {
				if (isTimeoutError(err)) {
					return c.json(
						{
							success: false as const,
							error: "Gateway timeout",
							details: [
								{
									field: "api_sports",
									message: "API-Sports request timed out",
									code: "timeout_error",
								},
							],
						},
						502,
					);
				}
				return c.json(
					{
						success: false as const,
						error: "Failed to fetch",
						details: [
							{
								field: "api_sports",
								message: `Fetch failed: ${err instanceof Error ? err.message : "Unknown error"}`,
								code: "fetch_error",
							},
						],
					},
					502,
				);
			}

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "api_sports",
								message: `API-Sports returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = (await response.json()) as any;
			const games = data.response || [];

			const transformedData = transformSchedule(games);

			if (getKvNamespace(c.env)) {
				try {
					await getKvNamespace(c.env)?.put(
						cacheKey,
						JSON.stringify({
							data: transformedData,
							expiresAt: Date.now() + 30 * 1000,
						}),
					);
				} catch (cacheErr) {
					console.warn("Cache write failed:", cacheErr);
				}
			}
			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (error) {
			console.error("Basketball schedule error:", error);
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

const basketballTournamentMatchesRoute = createRoute({
	method: "get",
	path: "/tournament/{tournamentId}",
	summary: "Get matches for a specific tournament on a date",
	description: "Retrieves matches for a specific tournament on a given date.",
	request: {
		params: basketballStandingsParam,
		query: basketballScheduleQuery,
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: successResponseSchema(BasketballTournamentScheduleSchema),
				},
			},
			description: "Successfully retrieved tournament matches",
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
	basketballTournamentMatchesRoute,
	async (c) => {
		try {
			const { tournamentId } = c.req.valid("param");
			const { date } = c.req.valid("query");

			const apiKey = c.env.API_SPORTS_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "API_SPORTS_KEY",
								message: "API-Sports key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_tournament_${tournamentId}_matches_${date}`;
			let cachedData = null;
			try {
				cachedData = (await getKvNamespace(c.env)?.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiSportsBase = "https://v1.basketball.api-sports.io";
			const [day, month, year] = date.split("/");
			const apiSportsDate = `${year}-${month}-${day}`;
			const apiUrl = `${apiSportsBase}/games?date=${apiSportsDate}`;

			let response: Response;
			try {
				response = await fetchWithTimeout(
					apiUrl,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				);
			} catch (err) {
				if (isTimeoutError(err)) {
					return c.json(
						{
							success: false as const,
							error: "Gateway timeout",
							details: [
								{
									field: "api_sports",
									message: "API-Sports request timed out",
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
								field: "api_sports",
								message: `API-Sports returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = (await response.json()) as any;
			const allGames = data.response || [];

			const filteredGames = allGames.filter(
				(game: any) => game.league?.id?.toString() === tournamentId,
			);

			const transformedData = transformSchedule(filteredGames);

			// transformSchedule returns { competitions: [{ id, name, games }...] }
			// The tournament schedule response shape expects { games, total, competition }
			const competition = transformedData.competitions[0];
			const responseData = {
				games: competition?.games ?? [],
				total: competition?.games?.length ?? 0,
				competition: {
					name: competition?.name ?? "",
					id: competition?.id ? Number(competition.id) : Number(tournamentId),
					imageUrl: competition?.imageUrl ?? null,
					country: competition?.country ?? undefined,
				},
			};

			if (getKvNamespace(c.env)) {
				try {
					await getKvNamespace(c.env)?.put(
						cacheKey,
						JSON.stringify({
							data: responseData,
							expiresAt: Date.now() + 30 * 1000,
						}),
					);
				} catch (cacheErr) {
					console.warn("Cache write failed:", cacheErr);
				}
			}

			return c.json(
				{
					success: true as const,
					data: responseData,
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
							message: "An unexpected error occurred",
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
			const apiKey = c.env.API_SPORTS_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "API_SPORTS_KEY",
								message: "API-Sports key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_game_${gameId}`;
			let cachedData = null;
			try {
				cachedData = (await getKvNamespace(c.env)?.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiSportsBase = "https://v1.basketball.api-sports.io";

			const [summaryRes, teamStatsRes, playersRes] = await Promise.all([
				fetchWithTimeout(
					`${apiSportsBase}/games?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
				fetchWithTimeout(
					`${apiSportsBase}/games/statistics/teams?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
				fetchWithTimeout(
					`${apiSportsBase}/games/statistics/players?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
			]);

			if (!summaryRes.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "api_sports",
								message: `Summary API returned status ${summaryRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			if (!teamStatsRes.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "api_sports",
								message: `Team Stats API returned status ${teamStatsRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const summaryData = await summaryRes.json();
			const teamStatsData = await teamStatsRes.json();
			const playersData = playersRes.ok
				? await playersRes.json()
				: { response: [] };

			const transformedData = transformGameSummaryApiSports(
				summaryData as any,
				teamStatsData as any,
				playersData as any,
			);

			const isClosed =
				transformedData.status === "Full Time" ||
				transformedData.status === "Finished A.E.T." ||
				transformedData.status === "closed";

			if (getKvNamespace(c.env)) {
				try {
					await getKvNamespace(c.env)?.put(
						cacheKey,
						JSON.stringify({
							data: transformedData,
							expiresAt: isClosed
								? Date.now() + 2 * 60 * 1000
								: Date.now() + 2 * 1000,
						}),
					);
				} catch (cacheErr) {
					console.warn("Cache write failed:", cacheErr);
				}
			}

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
			const apiKey = c.env.API_SPORTS_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "API_SPORTS_KEY",
								message: "API-Sports key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_game_${gameId}_stats`;
			let cachedData = null;
			try {
				cachedData = (await getKvNamespace(c.env)?.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiSportsBase = "https://v1.basketball.api-sports.io";
			const [gameRes, teamStatsRes, playersRes] = await Promise.all([
				fetchWithTimeout(
					`${apiSportsBase}/games?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
				fetchWithTimeout(
					`${apiSportsBase}/games/statistics/teams?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
				fetchWithTimeout(
					`${apiSportsBase}/games/statistics/players?id=${gameId}`,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				),
			]);

			if (!gameRes.ok) {
				if (gameRes.status === 404) {
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
								field: "api_sports",
								message: `Game API returned status ${gameRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			if (!teamStatsRes.ok) {
				if (teamStatsRes.status === 404) {
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
								field: "api_sports",
								message: `API-Sports returned status ${teamStatsRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const gameData = await gameRes.json();
			const teamStatsData = await teamStatsRes.json();
			const playersData = playersRes.ok
				? await playersRes.json()
				: { response: [] };
			const transformedData = transformGameTeamStats(
				gameData as any,
				teamStatsData as any,
				playersData as any,
			);

			if (getKvNamespace(c.env)) {
				try {
					await getKvNamespace(c.env)?.put(
						cacheKey,
						JSON.stringify({
							data: transformedData,
							expiresAt: Date.now() + 5 * 1000,
						}),
					);
				} catch (cacheErr) {
					console.warn("Cache write failed:", cacheErr);
				}
			}

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
			const apiKey = c.env.API_SPORTS_KEY;

			if (!apiKey) {
				return c.json(
					{
						success: false as const,
						error: "Configuration error",
						details: [
							{
								field: "API_SPORTS_KEY",
								message: "API-Sports key is missing",
								code: "missing_api_key",
							},
						],
					},
					500,
				);
			}

			const cacheKey = `basketball_standings_${tournamentId}`;
			let cachedData = null;
			try {
				cachedData = (await getKvNamespace(c.env)?.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

			if (cachedData && Date.now() <= cachedData.expiresAt) {
				return c.json(
					{
						success: true as const,
						data: cachedData.data,
					},
					200,
				);
			}

			const apiSportsBase = "https://v1.basketball.api-sports.io";
			const currentYear = new Date().getFullYear();
			const currentMonth = new Date().getMonth();
			const season =
				currentMonth >= 9
					? `${currentYear}-${currentYear + 1}`
					: `${currentYear - 1}-${currentYear}`;
			const url = `${apiSportsBase}/standings?league=${tournamentId}&season=${season}`;

			let response: Response;
			try {
				response = await fetchWithTimeout(
					url,
					{
						headers: {
							"x-rapidapi-host": "v1.basketball.api-sports.io",
							"x-rapidapi-key": apiKey,
							Accept: "application/json",
						},
					},
					10000,
				);
			} catch (err) {
				if (isTimeoutError(err)) {
					return c.json(
						{
							success: false as const,
							error: "Gateway timeout",
							details: [
								{
									field: "api_sports",
									message: "API-Sports request timed out",
									code: "timeout_error",
								},
							],
						},
						502,
					);
				}
				throw err;
			}

			console.log(url);

			if (!response.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "api_sports",
								message: `API-Sports returned status ${response.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = (await response.json()) as any;
			const transformedData = transformApiSportsStandings(data);

			if (getKvNamespace(c.env)) {
				try {
					await getKvNamespace(c.env)?.put(
						cacheKey,
						JSON.stringify({
							data: transformedData,
							expiresAt: Date.now() + 60 * 60 * 1000,
						}),
					);
				} catch (cacheErr) {
					console.warn("Cache write failed:", cacheErr);
				}
			}

			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (error) {
			console.error("Basketball standings error:", error);
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
			let cachedData = null;
			try {
				cachedData = (await c.env.sportsdey_ns.get(cacheKey, "json")) as {
					data: any;
					expiresAt: number;
				} | null;
			} catch (e) {
				cachedData = null;
			}

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
