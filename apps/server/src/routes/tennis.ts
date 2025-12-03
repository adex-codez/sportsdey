import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
	ErrorResponseSchema,
	successResponseSchema,
	TennisMatchInfoData,
	TennisScheduleData,
} from "@/schemas";
import type { SportRadarTennisResponse } from "@/types";
import { transformTennisData } from "@/utils/tennis";
import { tennisScheduleParam, tennisScheduleQuery } from "@/validators";
import { jsonZodErrorFormatter } from "@/utils/zod";
import type {
	SportRadarTennisGameResponse,
	SportRadarTennisResponse,
} from "@/types";
import { transformTennisData, transformTennisMatchData } from "@/utils/tennis";
import {
	tennisGameIdParam,
	tennisScheduleParam,
	tennisScheduleQuery,
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

tennisRoute.openapi(tennisScheduleRoute, async (c) => {
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
}, jsonZodErrorFormatter);

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

export default tennisRoute;
