import type {
	CompetitionGroup,
	ScheduleRes,
	TransformedCompetitor,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

export function transformFootballSchedule(
	data: ScheduleRes,
): TransformedResponse {
	// Use a Map to group schedules by competition
	const competitionMap = new Map<string, CompetitionGroup>();

	// Iterate through each schedule and group by competition
	data.schedules.forEach((schedule) => {
		const { sport_event, sport_event_status, clock } = schedule;
		const { sport_event_context, competitors } = sport_event;
		const { competition, category } = sport_event_context;

		const competitionId = competition.id;

		// Create competition group if it doesn't exist
		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: competition.id,
					name: competition.name,
					gender: competition.gender,
				},
				category: {
					id: category.id,
					name: category.name,
				},
				matches: [],
			});
		}

		// Map scores to competitors based on qualifier
		const competitorsWithScores: TransformedCompetitor[] = competitors.map(
			(competitor) => ({
				id: competitor.id,
				name: competitor.name,
				abbreviation: competitor.abbreviation,
				qualifier: competitor.qualifier,
				score:
					competitor.qualifier === "home"
						? sport_event_status.home_score
						: sport_event_status.away_score,
			}),
		);

		// Create match object
		const match: TransformedMatch = {
			sport_event_id: sport_event.id,
			competitors: competitorsWithScores,
			start_time: sport_event.start_time,
			match_status: sport_event_status.match_status,
			clock: clock
				? {
						played: clock.played,
					}
				: {
						played: "done",
					},
		};

		// Add match to the competition group
		competitionMap.get(competitionId)!.matches.push(match);
	});

	// Convert Map to array
	const competitions = Array.from(competitionMap.values());

	// Calculate total matches count
	const total_matches = data.schedules.length;

	return { competitions, total_matches };
}

export function transformFootballMatchInfo(
	data: any,
	standings: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
): TransformedMatchInfo {
	const event = data.sport_event;
	const status = data.sport_event_status;

	const competitors = event.competitors.map((c: any) => ({
		id: c.id,
		name: c.name,
		qualifier: c.qualifier,
		score: c.qualifier === "home" ? status.home_score : status.away_score,
	}));

	const transformed: TransformedMatchInfo = {
		competition: {
			id: event.sport_event_context.competition.id,
			name: event.sport_event_context.competition.name,
			gender: event.sport_event_context.competition.gender,
		},
		season: {
			id: event.sport_event_context.season.id,
		},
		competitors,
		match_info: {
			date_time: event.start_time,
			stadium: event.venue?.name ?? "",
			capacity: event.venue?.capacity ?? 0,
		},
		status: status.match_status,
	};

	// Add clock only if status is not "ended" and clock exists
	if (status.match_status !== "ended" && data.clock) {
		transformed.clock = {
			played: data.clock.played,
			stoppage_time_played: data.clock.stoppage_time_played ?? "",
		};
	}

	if (standings) {
		transformed.standings = standings;
	}
	if (top_scorers) {
		transformed.top_scorers = top_scorers;
	}

	return transformed;
}

/**
 * Extracts the top 3 leaders of type 'points' from the leaders API response.
 * Each leader includes id, name, team info, gs (goals), and assists.
 */
export function transformTopScorers(
	leadersData: any,
): import("@/types/football").TopScorer[] {
	const pointsList = leadersData.lists?.filter(
		(list: any) => list.type === "points",
	);
	if (!pointsList.leaders) return [];

	return pointsList.leaders.slice(0, 3).map((leader: any) => {
		const player = leader.players[0];
		const team = player.competitors[0];
		const goals =
			team.datapoints.find((dp: any) => dp.type === "goals")?.value ?? 0;
		const assists =
			team.datapoints.find((dp: any) => dp.type === "assists")?.value ?? 0;

		return {
			id: player.id,
			name: player.name,
			team: {
				id: team.id,
				name: team.name,
				abbreviation: team.abbreviation,
			},
			gs: goals,
			assists,
		};
	});
}
