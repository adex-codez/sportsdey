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
