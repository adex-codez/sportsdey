import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

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

// Define response schemas with proper typing
const GameSchema = z.object({
	id: z.string(),
	status: z.enum([
		"scheduled",
		"created",
		"inprogress",
		"halftime",
		"complete",
		"closed",
		"cancelled",
		"delayed",
		"postponed",
		"time-tbd",
		"if-necessary",
		"unnecessary",
	]),
	home: z.object({
		name: z.string(),
		alias: z.string(),
		points: z.number().nullable(),
	}),
	away: z.object({
		name: z.string(),
		alias: z.string(),
		points: z.number().nullable(),
	}),
});

const SuccessResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		league: z.string(),
		games: z.array(GameSchema),
	}),
});

const ErrorDetailSchema = z.object({
	field: z.string(),
	message: z.string(),
	code: z.string(),
});

const ErrorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.array(ErrorDetailSchema),
});

// Create the route with proper parameter names that match the path
const basketballScheduleRoute = createRoute({
	method: "get",
	path: "/schedule/{year}/{month}/{day}",
	summary: "Get NBA schedule for a specific date",
	description: "Retrieves NBA games scheduled for the specified date",
	request: {
		params: z.object({
			year: z
				.string()
				.regex(/^\d{4}$/, "Year must be a 4-digit number")
				.transform((val) => Number.parseInt(val, 10))
				.refine((val) => val >= 1900, "Year must be at least 1900")
				.openapi({
					param: { name: "year", in: "path" },
					description: "Year which the game was played",
					example: "2025",
				}),
			month: z
				.string()
				.regex(/^(0?[1-9]|1[0-2])$/, "Month must be between 1-12")
				.transform((val) => Number.parseInt(val, 10))
				.openapi({
					param: { name: "month", in: "path" },
					description: "Month which the game was played",
					example: "11",
				}),
			day: z
				.string()
				.regex(/^(0?[1-9]|[12]\d|3[01])$/, "Day must be between 1-31")
				.transform((val) => Number.parseInt(val, 10))
				.openapi({
					param: { name: "day", in: "path" },
					description: "Day which the game was played",
					example: "19",
				}),
		}),
		query: z.object({
			language: z
				.string()
				.regex(
					/^[a-z]{2}$/,
					"Language must be a 2-letter language code (e.g., 'en', 'es', 'fr')",
				)
				.optional()
				.default("en")
				.openapi({
					param: { name: "language", in: "query" },
					description:
						"Language you want the result to be in (e.g., 'en', 'es', 'fr'). Default is 'en'",
					example: "en",
				}),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: SuccessResponseSchema,
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

basketballRoute.openapi(basketballScheduleRoute, async (c) => {
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
		const cachedData = (await c.env.sportsdey_ns.get(
			"basketball_schedule",
			"json",
		)) as any;

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
			"basketball_schedule",
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
		console.error("Error fetching basketball schedule:", error);
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

const gameSummaryRoute = createRoute({});

export default basketballRoute;
