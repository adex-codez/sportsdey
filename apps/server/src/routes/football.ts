import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
	ErrorResponseSchema,
	successResponseSchema,
	TransformedMatchInfoSchema,
	TransformedResponseSchema,
	VideoResponseSchema,
} from "@/schemas";
import type { ScheduleRes } from "@/types";
import type { StandingsRes, TeamStanding } from "@/types/football";
import { fetchWithErrorHandling } from "@/utils";
import {
	getLast5Matches,
	transformFootballMatchInfo,
	transformFootballSchedule,
	transformTopScorers,
} from "@/utils/football";
import { jsonZodErrorFormatter } from "@/utils/zod";
import { footballVideosQuery } from "@/validators";
const footballRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

footballRoute.openapi(
	createRoute({
		method: "get",
		path: "/schedule/{date}",
		request: {
			params: z.object({
				date: z.string().openapi({
					description: "Schedule date (YYYY-MM-DD)",
					example: "2024-09-15",
				}),
			}),
			query: z.object({
				lang: z
					.string()
					.optional()
					.openapi({ description: "Language code", example: "en" }),
			}),
		},
		responses: {
			200: {
				description: "Transformed football schedule",
				content: {
					"application/json": {
						schema: successResponseSchema(TransformedResponseSchema),
					},
				},
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
		tags: ["Football"],
		summary: "Get football schedule for a given date",
	}),
	async (c) => {
		const { date } = c.req.valid("param");
		const { lang } = c.req.valid("query");
		const base = c.env.SPORTRADAR_URL;
		const apiKey = c.env.SPORTRADAR_API_KEY;

		const langSegment = lang ? `${encodeURIComponent(lang)}/` : "en";
		const url = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/schedules/${encodeURIComponent(
			date,
		)}/schedules.json`;

		const cachedData = (await c.env.sportsdey_ns.get(
			`football_schedule_${date}`,
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

		try {
			const upstream = await fetch(url, {
				headers: { "x-api-key": apiKey, Accept: "application/json" },
			});

			if (!upstream.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "sportradar_api",
								message: `SportRadar API returned status ${upstream.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = (await upstream.json()) as ScheduleRes;

			// Transform the data before returning
			const transformedData = transformFootballSchedule(data);

			await c.env.sportsdey_ns.put(
				`football_schedule_${date}`,
				JSON.stringify({
					data: transformedData,
					expiresAt: Date.now() + 5000,
				}),
			);

			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (err) {
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
);

footballRoute.openapi(
	createRoute({
		method: "get",
		path: "/match/{id}",
		request: {
			params: z.object({
				id: z.string().openapi({
					description: "Match ID",
					example: "sr:sport_event:50850045",
				}),
			}),
			query: z.object({
				lang: z
					.string()
					.optional()
					.openapi({ description: "Language code", example: "en" }),
			}),
		},
		responses: {
			200: {
				description: "Match info",
				content: {
					"application/json": {
						schema: successResponseSchema(TransformedMatchInfoSchema),
					},
				},
			},
			400: {
				description: "Bad request - invalid parameters or upstream error",
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
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
		tags: ["Football"],
		summary: "Get football match info by ID",
	}),
	async (c) => {
		const { id } = c.req.valid("param");
		const base = c.env.SPORTRADAR_URL;
		const apiKey = c.env.SPORTRADAR_API_KEY;
		const { lang } = c.req.valid("query");

		const langSegment = lang ? `${encodeURIComponent(lang)}/` : "en";
		const url = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/sport_events/${encodeURIComponent(
			id,
		)}/summary.json`;

		const cachedData = (await c.env.sportsdey_ns.get(
			`match_${id}`,
			"json",
		)) as {
			data: any;
			expiresAt: number;
		} | null;

		// if (cachedData && Date.now() <= cachedData.expiresAt) {
		// 	return c.json(
		// 		{
		// 			success: true as const,
		// 			data: cachedData.data,
		// 		},
		// 		200,
		// 	);
		// }

		try {
			const upstream = await fetch(url, {
				headers: { "x-api-key": apiKey, Accept: "application/json" },
			});
			console.log(upstream.ok);

			if (!upstream.ok) {
				if (upstream.status === 400) {
					return c.json(
						{
							success: false as const,
							error: "External API error",
							details: [
								{
									field: "sportradar_api",
									message: "Bad request (400)",
									code: "external_api_error",
								},
							],
						},
						400,
					);
				}
				if (upstream.status === 500) {
					return c.json(
						{
							success: false as const,
							error: "External API error",
							details: [
								{
									field: "sportradar_api",
									message: "Bad request (400)",
									code: "external_api_error",
								},
							],
						},
						500,
					);
				}
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "sportradar_api",
								message: `SportRadar API returned status ${upstream.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data: any = await upstream.json();

			const seasonId = data.sport_event.sport_event_context.season.id;
			// const competitionId = data.sport_event.sport_event_context.groups[0].id;
			const teamIds = data.sport_event.competitors.map((c: any) => c.id);

			const standingsUrl = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/seasons/${encodeURIComponent(seasonId)}/standings.json`;
			const leadersUrl = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/seasons/${encodeURIComponent(seasonId)}/leaders.json`;

			const [homeTeamId, awayTeamId] = data.sport_event.competitors.map(
				(c: any) => c.id,
			);

			const homeSummaryUrl = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/competitors/${encodeURIComponent(homeTeamId)}/summaries.json`;
			const awaySummaryUrl = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/competitors/${encodeURIComponent(awayTeamId)}/summaries.json`;

			const [
				standingsResult,
				leadersResult,
				homeSummaryResult,
				awaySummaryResult,
			] = await Promise.all([
				fetchWithErrorHandling(standingsUrl, apiKey),
				fetchWithErrorHandling(leadersUrl, apiKey),
				fetchWithErrorHandling(homeSummaryUrl, apiKey),
				fetchWithErrorHandling(awaySummaryUrl, apiKey),
			]);

			if (!homeSummaryResult.ok) {
				const { status, ...error } = homeSummaryResult.error!;
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [error],
					},
					status === 500 ? 500 : status === 400 ? 400 : 502,
				);
			}
			if (!awaySummaryResult.ok) {
				const { status, ...error } = awaySummaryResult.error!;
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [error],
					},
					status === 500 ? 500 : status === 400 ? 400 : 502,
				);
			}
			if (!standingsResult.ok) {
				const { status, ...error } = standingsResult.error!;
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [error],
					},
					status === 500 ? 500 : status === 400 ? 400 : 502,
				);
			}
			if (!leadersResult.ok) {
				const { status, ...error } = leadersResult.error!;
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [error],
					},
					status === 500 ? 500 : status === 400 ? 400 : 502,
				);
			}

			const standingsData = standingsResult.data as StandingsRes;
			const leadersData = leadersResult.data;

			const standingsArr = standingsData.standings;
			const filteredStandings = standingsArr
				.filter((standing) => standing.type === "total")
				.flatMap((standing) =>
					standing.groups.flatMap((group) =>
						group.standings
							.filter((team: any) => teamIds.includes(team.competitor.id))
							.map(
								(team: any): TeamStanding => ({
									id: team.competitor.id,
									name: team.competitor.name,
									position: team.rank,
									points: team.points,
									played: team.played,
									won: team.win,
									drawn: team.draw,
									lost: team.loss,
									goals_for: team.goals_for,
									goals_against: team.goals_against,
									goal_diff: team.goals_diff,
								}),
							),
					),
				)
				.sort((a: TeamStanding, b: TeamStanding) => a.position - b.position);

			const topScorers = transformTopScorers(leadersData);

			const last5HomeResults = getLast5Matches(
				homeSummaryResult.data,
				homeTeamId,
			);
			const last5AwayResults = getLast5Matches(
				awaySummaryResult.data,
				awayTeamId,
			);

			const transformedData = {
				...transformFootballMatchInfo(data, filteredStandings, topScorers),
				last5_home_results: last5HomeResults,
				last5_away_results: last5AwayResults,
			};

			await c.env.sportsdey_ns.put(
				`match_${id}`,
				JSON.stringify({
					data: transformedData,
					expiresAt:
						transformedData.status === "finished"
							? Date.now() + 2 * 60 * 1000
							: Date.now() + 5000,
				}),
			);

			return c.json(
				{
					success: true as const,
					data: transformedData,
				},
				200,
			);
		} catch (err) {
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

footballRoute.openapi(
	createRoute({
		method: "get",
		path: "/videos",
		summary: "Get YouTube videos for a football match",
		description:
			"Retrieves YouTube videos related to a specific football match query, ordered by date. If there is only nextPageToken that means that's the first set of videos. If there is only prevPageToken that means that's the last set of videos. If both nextPageToken and prevPageToken are present then there are more videos available. You can pass any of the two to the pageToken query so for pagination",
		request: {
			query: footballVideosQuery,
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
		tags: ["Football"],
	}),
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

			const cacheKey = `football_videos_${query}_${pageToken || "first"}`;
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
					videoEmbedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
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

export default footballRoute;
