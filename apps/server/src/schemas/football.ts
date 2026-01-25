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
			shortName: z.string(),
			score: z.number(),
		}),
		away: z.object({
			id: z.string(),
			name: z.string(),
			shortName: z.string(),
			score: z.number(),
		}),
	}),
	match_info: z.object({
		date_time: z.string(),
		stadium: z.string(),
		// capacity: z.number(),
	}),
	clock: z.number().optional(),
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
					clock: z.number().optional(),
				}),
			),
		}),
	),
	total_matches: z.number(),
});

const TeamStatsSchema = z.object({
	ballPossession: z.number().openapi({ example: 65 }),
	shotsOnTarget: z.number().openapi({ example: 3 }),
	shotsOffTarget: z.number().openapi({ example: 12 }),
	fouls: z.number().openapi({ example: 17 }),
	corners: z.number().openapi({ example: 5 }),
	offsides: z.number().openapi({ example: 1 }),
	saves: z.number().openapi({ example: 1 }),
	yellowCards: z.number().openapi({ example: 3 }),
	secondYellowCards: z.number().openapi({ example: 0 }),
	redCards: z.number().openapi({ example: 0 }),
});

export const MatchStatsSchema = z.object({
	home: z.object({
		statistics: TeamStatsSchema,
		name: z.string().openapi({ example: "Melbourne City" }),
		id: z.number().openapi({ example: 15272 }),
	}),
	away: z.object({
		statistics: TeamStatsSchema,
		name: z.string().openapi({ example: "Brisbane Roar" }),
		id: z.number().openapi({ example: 8722 }),
	}),
	date: z.string().openapi({ example: "06/01/2026 08:00:00" }),
	id: z.number().openapi({ example: 1985541 }),
});

export const FullStandingsSchema = z.object({
	tournament: z.object({
		id: z.number().openapi({ example: 2 }),
		name: z.string().openapi({ example: "English Premier League" }),
	}),
	standings: z.array(
		z.object({
			name: z.string().openapi({ example: "Arsenal" }),
			position: z.number().openapi({ example: 1 }),
			statistics: z.object({
				P: z.number().openapi({ example: 20 }),
				W: z.number().openapi({ example: 15 }),
				D: z.number().openapi({ example: 3 }),
				L: z.number().openapi({ example: 2 }),
				GD: z.number().openapi({ example: 26 }),
				PTS: z.number().openapi({ example: 48 }),
			}),
		}),
	),
});

export const TournamentScheduleSchema = z.object({
	total_matches: z.number(),
	competition: z.object({
		name: z.string(),
		id: z.number(),
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
			start_time: z.string(),
			match_status: z.string(),
			clock: z.number().optional(),
		}),
	),
});
