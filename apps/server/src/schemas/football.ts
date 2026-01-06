import { z } from "zod";

export const TransformedMatchInfoSchema = z.object({
	competition: z.object({
		id: z.string(),
		name: z.string(),
	}),
	competitors: z.object({
		home: z.object({
			id: z.string(),
			name: z.string(),
			score: z.number(),
		}),
		away: z.object({
			id: z.string(),
			name: z.string(),
			score: z.number(),
		}),
	}),
	match_info: z.object({
		date_time: z.string(),
		stadium: z.string(),
		// capacity: z.number(),
	}),
	clock: z
		.object({
			played: z.string(),
			stoppage_time_played: z.string().optional(),
		})
		.optional(),
	status: z.object({
		name: z.string(),
		shortname: z.string(),
	}),
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
				// assists: z.number(),
			}),
		)
		.optional(),
	homeH2H: z
		.array(
			z.object({
				id: z.string(),
				date: z.string(),
				result: z.enum(["W", "D", "L"]),
			}),
		)
		.optional(),
	awayH2H: z
		.array(
			z.object({
				id: z.string(),
				date: z.string(),
				result: z.enum(["W", "D", "L"]),
			}),
		)
		.optional(),
	// last5_home_results: z
	// 	.array(
	// 		z.object({
	// 			match_id: z.string(),
	// 			date: z.string(),
	// 			opponent: z.string(),
	// 			result: z.enum(["win", "draw", "loss"]),
	// 			score: z.string(),
	// 		}),
	// 	)
	// 	.optional(),
	// last5_away_results: z
	// 	.array(
	// 		z.object({
	// 			match_id: z.string(),
	// 			date: z.string(),
	// 			opponent: z.string(),
	// 			result: z.enum(["win", "draw", "loss"]),
	// 			score: z.string(),
	// 		}),
	// 	)
	// 	.optional(),
});

export const TransformedResponseSchema = z.object({
	competitions: z.array(
		z.object({
			competition: z.object({
				id: z.string(),
				name: z.string(),
			}),
			matches: z.array(
				z.object({
					id: z.string(),
					competitors: z.object({
						home: z.object({
							id: z.string(),
							name: z.string(),
							score: z.number(),
						}),
						away: z.object({
							id: z.string(),
							name: z.string(),
							score: z.number(),
						}),
					}),
					date: z.string(),
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
