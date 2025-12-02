import { z } from "@hono/zod-openapi";

export const TennisCompetitorSchema = z.object({
	id: z.string(),
	name: z.string(),
	qualifier: z.enum(["home", "away"]),
});

export const TennisSetScoreSchema = z.object({
	set_number: z.number(),
	games_won: z.number(),
	tiebreak_score: z.number().optional(),
});

export const TennisMatchSchema = z.object({
	id: z.string(),
	start_time: z.string(),
	status: z.string(),
	home_team: z.object({
		competitor: TennisCompetitorSchema,
		set_scores: z.array(TennisSetScoreSchema),
	}),
	away_team: z.object({
		competitor: TennisCompetitorSchema,
		set_scores: z.array(TennisSetScoreSchema),
	}),
	winner_id: z.string().optional(),
});

export const TennisCompetitionGroupSchema = z.object({
	competition: z.object({
		id: z.string(),
		name: z.string(),
		type: z.string().optional(),
		gender: z.string().optional(),
	}),
	matches: z.array(TennisMatchSchema),
});

export const TennisScheduleData = z.object({
	date: z.string(),
	total_matches: z.number(),
	competitions: z.array(TennisCompetitionGroupSchema),
});

export const TennisMatchInfoData = z.object({
	TennisMatchSchema,
	venue: z.string(),
});
