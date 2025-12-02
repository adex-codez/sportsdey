import { z } from "@hono/zod-openapi";
export const ScheduledGameSchema = z.object({
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
export const ScheduleData = z.object({
	league: z.string(),
	games: z.array(ScheduledGameSchema),
});

export const PlayerStatisticsSchema = z.object({
	field_goals_made: z.number(),
	field_goals_att: z.number(),
	field_goals_pct: z.number(),
	three_points_made: z.number(),
	three_points_att: z.number(),
	three_points_pct: z.number(),
	free_throws_made: z.number(),
	free_throws_att: z.number(),
	free_throws_pct: z.number(),
	rebounds: z.number(),
	offensive_rebounds: z.number(),
	defensive_rebounds: z.number(),
	assists: z.number(),
	steals: z.number(),
	blocks: z.number(),
	turnovers: z.number(),
	personal_fouls: z.number(),
});

export const PlayerSchema = z.object({
	full_name: z.string(),
	pls_min: z.number(),
	statistics: PlayerStatisticsSchema,
});

export const TeamSchema = z.object({
	name: z.string(),
	points: z.number(),
	starters: z.array(PlayerSchema),
	bench: z.array(PlayerSchema),
	statistics: z.object({
		minutes: z.string(),
		field_goals_made: z.number(),
		field_goals_att: z.number(),
		field_goals_pct: z.number(),
		three_points_made: z.number(),
		three_points_att: z.number(),
		three_points_pct: z.number(),
		free_throws_made: z.number(),
		free_throws_att: z.number(),
		free_throws_pct: z.number(),
		rebounds: z.number(),
		offensive_rebounds: z.number(),
		defensive_rebounds: z.number(),
		assists: z.number(),
		steals: z.number(),
		blocks: z.number(),
		turnovers: z.number(),
		personal_fouls: z.number(),
	}),
});

export const GameSummarySchema = z.object({
	id: z.string(),
	status: z.string(),
	season: z.object({
		id: z.string(),
		year: z.number(),
		type: z.string(),
		name: z.string(),
	}),
	clock: z.string(),
	quarter: z.number(),

	home: TeamSchema,
	away: TeamSchema,
});
export const StandingsSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			wins: z.number(),
			losses: z.number(),
			played: z.number(),
			streak: z.number(),
			gb: z.number(),
			diff: z.number(),
			win_pct: z.number(),
		}),
	),
});

export const TeamStatsSchema = z.object({
	name: z.string(),
	starters: z.array(PlayerSchema),
	bench: z.array(PlayerSchema),
});

export const GameTeamStatsSchema = z.object({
	home: TeamStatsSchema,
	away: TeamStatsSchema,
});
