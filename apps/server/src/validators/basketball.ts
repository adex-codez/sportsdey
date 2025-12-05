import { z } from "@hono/zod-openapi";

export const basketballScheduleParam = z.object({
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
});

export const basketballScheduleQuery = z.object({
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
});

export const gameIdParam = z.object({
	gameId: z.string().min(1, "Game ID is required"),
});

export const basketballStandingsParam = z.object({
	season: z.string().openapi({
		param: { name: "season", in: "path" },
		description: "Year of a season in YYYY format",
		example: "2025",
	}),
});

export const basketballStandingsQuery = z.object({
	conference: z.enum(["eastern", "western"]).openapi({
		param: { name: "conference", in: "query" },
		description:
			"The conference standing you are looking for which can either be western or eastern conference",
	}),
	limit: z.coerce
		.number()
		.min(1)
		.max(30)
		.default(13)
		.openapi({
			param: { name: "limit", in: "query" },
			description:
				"Limit controls the number of teams that are going to be shown at once",
		}),
	offset: z.coerce
		.number()
		.min(0)
		.default(0)
		.openapi({
			param: { name: "offset", in: "query" },
			description:
				"Offset controls the number of teams to skip when showing the data",
		}),
});

export const basketballVideosQuery = z.object({
	query: z.string().openapi({
		param: { name: "query", in: "query" },
		description: "The search query for the videos",
		example: "Lakers vs Warriors",
	}),
	pageToken: z
		.string()
		.optional()
		.openapi({
			param: { name: "pageToken", in: "query" },
			description: "The token for the next or previous page of results",
			example: "CAUQAA",
		}),
});
