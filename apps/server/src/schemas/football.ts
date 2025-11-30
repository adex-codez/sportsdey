import { z } from "zod";

export const TransformedMatchInfoSchema = z.object({
	competition: z.object({
		id: z.string(),
		name: z.string(),
		gender: z.string(),
	}),
	season: z.object({
		id: z.string(),
	}),
	competitors: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			qualifier: z.string(),
			score: z.number(),
		}),
	),
	match_info: z.object({
		date_time: z.string(),
		stadium: z.string(),
		capacity: z.number(),
	}),
	clock: z
		.object({
			played: z.string(),
			stoppage_time_played: z.string().optional(),
		})
		.optional(),
	status: z.string(),
	standings: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				position: z.number(),
				points: z.number(),
				played: z.number(),
				won: z.number(),
				drawn: z.number(),
				lost: z.number(),
				goals_for: z.number(),
				goals_against: z.number(),
				goal_diff: z.number(),
			}),
		)
		.optional(),
	top_scorers: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				team: z.object({
					id: z.string(),
					name: z.string(),
					abbreviation: z.string(),
				}),
				gs: z.number(),
				assists: z.number(),
			}),
		)
		.optional(),
});

export const TransformedResponseSchema = z.object({
	competitions: z.array(
		z.object({
			competition: z.object({
				id: z.string(),
				name: z.string(),
				gender: z.string(),
			}),
			category: z.object({
				id: z.string(),
				name: z.string(),
			}),
			matches: z.array(
				z.object({
					sport_event_id: z.string(),
					competitors: z.array(
						z.object({
							id: z.string(),
							name: z.string(),
							abbreviation: z.string(),
							qualifier: z.string(),
							score: z.number(),
						}),
					),
					start_time: z.string(),
					match_status: z.string(),
					clock: z
						.object({
							played: z.string(),
						})
						.optional(),
				}),
			),
		}),
	),
	total_matches: z.number(),
});
