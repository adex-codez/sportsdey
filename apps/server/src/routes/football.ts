import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
	ErrorResponseSchema,
	successResponseSchema,
	TransformedMatchInfoSchema,
	TransformedResponseSchema,
	VideoResponseSchema,
} from "@/schemas";
// import type { ScheduleRes } from "@/types";
// import type { StandingsRes, TeamStanding } from "@/types/football";
// import { fetchWithErrorHandling } from "@/utils";
import {
	transformProxyH2H,
	transformProxyMatchInfo,
	transformProxySchedule,
	transformProxyStandings,
	transformProxyTopScorers,
} from "@/utils/football";
import { jsonZodErrorFormatter } from "@/utils/zod";
import { footballVideosQuery } from "@/validators";
const footballRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

footballRoute.openapi(
	createRoute({
		method: "get",
		path: "/{status}",
		request: {
			params: z.object({
				status: z.string().openapi({
					description: "Matches status either all, scheduled and live",
					example: "all",
				}),
			}),
			query: z.object({
				lang: z
					.string()
					.optional()
					.openapi({ description: "Language code", example: "en" }),
				date: z.string().openapi({
					description: "Schedule date (DD-MM-YYYY)",
					example: "15/09/2024",
				}),
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
		const { status } = c.req.valid("param");
		const { date } = c.req.valid("query");
		const base = c.env.PROXY_URL;
		const proxySecret = c.env.PROXY_SECRET;

		let url = "";
		const cleanBase = base.replace(/\/+$/, "");

		if (status === "all") {
			url = `${cleanBase}/soccer/match/list?date=${date}`;
		} else {
			url = `${cleanBase}/soccer/match/list/${encodeURIComponent(
				status,
			)}/?date=${date}`;
		}

		console.log(url);

		const cachedData = (await c.env.sportsdey_ns.get(
			`football_schedule_${date}_${status}`,
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
				headers: {
					"X-Proxy-Auth": proxySecret,
					Accept: "application/json",
				},
			});

			if (!upstream.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Proxy API returned status ${upstream.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const data = (await upstream.json()) as any[];

			// Transform the data before returning
			const transformedData = transformProxySchedule(data);

			await c.env.sportsdey_ns.put(
				`football_schedule_${date}_${status}`,
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
					example: "1953516",
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
		const base = c.env.PROXY_URL;
		const proxySecret = c.env.PROXY_SECRET;
		const cleanBase = base.replace(/\/+$/, "");
		const summaryUrl = `${cleanBase}soccer/match/summary?matchId=${id}`;

		const cachedData = (await c.env.sportsdey_ns.get(
			`match_${id}`,
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
			// 1. Fetch Match Summary
			const summaryRes = await fetch(summaryUrl, {
				headers: {
					"X-Proxy-Auth": proxySecret,
					Accept: "application/json",
				},
			});

			if (!summaryRes.ok) {
				return c.json(
					{
						success: false as const,
						error: "External API error",
						details: [
							{
								field: "proxy_api",
								message: `Proxy API (summary) returned status ${summaryRes.status}`,
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const summaryData = (await summaryRes.json()) as any;
			const tournamentId = summaryData.tournament?.id;

			if (!tournamentId) {
				return c.json(
					{
						success: false as const,
						error: "Data missing",
						details: [
							{
								field: "proxy_api",
								message: "Tournament ID missing in summary",
								code: "external_api_error",
							},
						],
					},
					502,
				);
			}

			const standingsUrl = `${cleanBase}/soccer/tournament/standings?tournamentId=${tournamentId}`;
			const leadersUrl = `${cleanBase}/soccer/tournament/leaderboard/goal?tournamentId=${tournamentId}`;
			const h2hUrl = `${cleanBase}/soccer/h2h/match/list/recent/?matchId=${id}`;
			const standingsCacheKey = `standing_${tournamentId}`;

			const [leadersRes, h2hRes, cachedStandings] = await Promise.all([
				fetch(leadersUrl, {
					headers: { "X-Proxy-Auth": proxySecret, Accept: "application/json" },
				}),
				fetch(h2hUrl, {
					headers: { "X-Proxy-Auth": proxySecret, Accept: "application/json" },
				}),
				c.env.sportsdey_ns.get(standingsCacheKey, "json") as Promise<{
					data: any;
					expiresAt: number;
				} | null>,
			]);

			let standingsData: any[] = [];

			if (cachedStandings && Date.now() <= cachedStandings.expiresAt) {
				standingsData = cachedStandings.data;
			} else {
				const standingsRes = await fetch(standingsUrl, {
					headers: { "X-Proxy-Auth": proxySecret, Accept: "application/json" },
				});

				if (standingsRes.ok) {
					standingsData = (await standingsRes.json()) as any[];
					await c.env.sportsdey_ns.put(
						standingsCacheKey,
						JSON.stringify({
							data: standingsData,
							expiresAt: Date.now() + 12 * 60 * 60 * 1000,
						}),
					);
				}
			}

			let leadersData: any[] = [];
			if (leadersRes.ok) {
				leadersData = (await leadersRes.json()) as any[];
			}

			let h2hData: any = null;
			if (h2hRes.ok) {
				h2hData = await h2hRes.json();
			}

			const homeTeamId = summaryData.homeTeam.id.toString();
			const awayTeamId = summaryData.awayTeam.id.toString();
			const teamIds = [homeTeamId, awayTeamId];

			const transformedStandings = transformProxyStandings(
				standingsData,
				teamIds,
			);
			const transformedTopScorers = transformProxyTopScorers(leadersData);
			const transformedH2H = transformProxyH2H(h2hData, homeTeamId, awayTeamId);
			const transformedData = transformProxyMatchInfo(
				summaryData,
				transformedStandings,
				transformedTopScorers,
				transformedH2H,
			);

			const isFinished =
				transformedData.status.shortname === "FT" ||
				transformedData.status.name === "Full Time" ||
				transformedData.status.name === "Ended"; // covering bases

			await c.env.sportsdey_ns.put(
				`match_${id}`,
				JSON.stringify({
					data: transformedData,
					expiresAt: isFinished
						? Date.now() + 2 * 60 * 1000 // 2 mins for finished
						: Date.now() + 5000, // 5 secs for live/others
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
			console.error("Match info error:", err);
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
