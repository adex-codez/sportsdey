import type {
	SportRadarTennisGameResponse,
	SportRadarTennisResponse,
} from "@/types/tennis";

export function transformTennisData(
	apiResponse: SportRadarTennisResponse,
	requestedDate: string,
) {
	const competitionGroups = new Map();

	for (const summary of apiResponse.summaries) {
		const { sport_event, sport_event_status } = summary;
		const competitionId = sport_event.sport_event_context.competition.id;

		if (!competitionGroups.has(competitionId)) {
			competitionGroups.set(competitionId, {
				competition: sport_event.sport_event_context.competition,
				matches: [],
			});
		}

		const homeCompetitor = sport_event.competitors.find(
			(c) => c.qualifier === "home",
		);
		const awayCompetitor = sport_event.competitors.find(
			(c) => c.qualifier === "away",
		);

		const homeSetScores = [];
		const awaySetScores = [];

		if (sport_event_status.period_scores) {
			for (const periodScore of sport_event_status.period_scores) {
				if (periodScore.type === "set") {
					const homeSetScore: any = {
						set_number: periodScore.number,
						games_won: periodScore.home_score,
					};
					if (periodScore.home_tiebreak_score !== undefined) {
						homeSetScore.tiebreak_score = periodScore.home_tiebreak_score;
					}
					homeSetScores.push(homeSetScore);

					const awaySetScore: any = {
						set_number: periodScore.number,
						games_won: periodScore.away_score,
					};
					if (periodScore.away_tiebreak_score !== undefined) {
						awaySetScore.tiebreak_score = periodScore.away_tiebreak_score;
					}
					awaySetScores.push(awaySetScore);
				}
			}
		}

		const match = {
			id: sport_event.id,
			start_time: sport_event.start_time,
			status: sport_event_status.status,
			home_team: {
				competitor: {
					id: homeCompetitor?.id || "",
					name: homeCompetitor?.name || "",
					qualifier: "home" as const,
				},
				set_scores: homeSetScores,
			},
			away_team: {
				competitor: {
					id: awayCompetitor?.id || "",
					name: awayCompetitor?.name || "",
					qualifier: "away" as const,
				},
				set_scores: awaySetScores,
			},
			winner_id: sport_event_status.winner_id,
		};

		competitionGroups.get(competitionId).matches.push(match);
	}

	const competitions = Array.from(competitionGroups.values());
	const totalMatches = competitions.reduce(
		(sum, comp) => sum + comp.matches.length,
		0,
	);

	return {
		date: requestedDate,
		total_matches: totalMatches,
		competitions,
	};
}

export function transformTennisMatchData(
	apiResponse: SportRadarTennisGameResponse,
) {
	const { sport_event, sport_event_status } = apiResponse;

	const homeCompetitor = sport_event.competitors.find(
		(c) => c.qualifier === "home",
	);
	const awayCompetitor = sport_event.competitors.find(
		(c) => c.qualifier === "away",
	);

	const homeSetScores = [];
	const awaySetScores = [];

	if (sport_event_status.period_scores) {
		for (const periodScore of sport_event_status.period_scores) {
			if (periodScore.type === "set") {
				const homeSetScore: any = {
					set_number: periodScore.number,
					games_won: periodScore.home_score,
				};
				if (periodScore.home_tiebreak_score !== undefined) {
					homeSetScore.tiebreak_score = periodScore.home_tiebreak_score;
				}
				homeSetScores.push(homeSetScore);

				const awaySetScore: any = {
					set_number: periodScore.number,
					games_won: periodScore.away_score,
				};
				if (periodScore.away_tiebreak_score !== undefined) {
					awaySetScore.tiebreak_score = periodScore.away_tiebreak_score;
				}
				awaySetScores.push(awaySetScore);
			}
		}
	}

	const match = {
		id: sport_event.id,
		start_time: sport_event.start_time,
		status: sport_event_status.status,
		venue: {
			name: sport_event.venue.name,
			country: sport_event.venue.country,
			country_code: sport_event.venue.country_code,
			city: sport_event.venue.city,
		},
		competition: {
			id: sport_event.sport_event_context.competition.id,
			name: sport_event.sport_event_context.competition.name,
			type: sport_event.sport_event_context.competition.type,
			gender: sport_event.sport_event_context.competition.gender,
		},
		home_team: {
			competitor: {
				id: homeCompetitor?.id || "",
				name: homeCompetitor?.name || "",
				qualifier: "home" as const,
			},
			set_scores: homeSetScores,
		},
		away_team: {
			competitor: {
				id: awayCompetitor?.id || "",
				name: awayCompetitor?.name || "",
				qualifier: "away" as const,
			},
			set_scores: awaySetScores,
		},
		winner_id: sport_event_status.winner_id,
	};

	return {
		match,
	};
}
