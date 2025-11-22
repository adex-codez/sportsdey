import type {
	CompetitionGroup,
	ScheduleRes,
	TransformedCompetitor,
	TransformedMatch,
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
			competitors: competitorsWithScores,
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

	return { competitions };
}
