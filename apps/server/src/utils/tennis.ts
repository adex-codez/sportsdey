import type { ApiTennisFixturesResponse } from "@/types/tennis";

function mapTennisStatus(status: string): string {
	if (status === "Finished") return "closed";
	if (status?.startsWith("Set")) return "inprogress";
	return "scheduled";
}

export function transformTennisData(
	apiResponse: ApiTennisFixturesResponse,
	requestedDate: string,
) {
	const competitionGroups = new Map<string, any>();

	if (!apiResponse.result || !Array.isArray(apiResponse.result)) {
		return {
			date: requestedDate,
			total_matches: 0,
			competitions: [],
		};
	}

	for (const event of apiResponse.result) {
		const tournamentKey = event.tournament_key;

		if (!competitionGroups.has(tournamentKey)) {
			competitionGroups.set(tournamentKey, {
				competition: {
					id: event.tournament_key,
					name: event.tournament_name,
					type: event.event_type_type,
				},
				matches: [],
			});
		}

		const homeSetScores: any[] = [];
		const awaySetScores: any[] = [];

		if (event.scores && event.scores.length > 0) {
			for (const score of event.scores) {
				homeSetScores.push({
					set_number: Number.parseInt(score.score_set, 10),
					games_won: Number.parseInt(score.score_first, 10),
				});
				awaySetScores.push({
					set_number: Number.parseInt(score.score_set, 10),
					games_won: Number.parseInt(score.score_second, 10),
				});
			}
		}

		const startTime = `${event.event_date} ${event.event_time}`;

		let winnerId: string | undefined;
		if (event.event_winner) {
			winnerId =
				event.event_winner === "First Player"
					? event.first_player_key
					: event.second_player_key;
		}

		const match = {
			id: event.event_key,
			start_time: startTime,
			status: mapTennisStatus(event.event_status),
			home: {
				id: event.first_player_key,
				name: event.event_first_player,
				set_scores: homeSetScores,
			},
			away: {
				id: event.second_player_key,
				name: event.event_second_player,
				set_scores: awaySetScores,
			},
			winner_id: winnerId,
		};

		competitionGroups.get(tournamentKey).matches.push(match);
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

export function transformTennisMatchData(event: any) {
	const homeSetScores: any[] = [];
	const awaySetScores: any[] = [];

	if (event.scores && event.scores.length > 0) {
		for (const score of event.scores) {
			homeSetScores.push({
				set_number: Number.parseInt(score.score_set, 10),
				games_won: Number.parseInt(score.score_first, 10),
			});
			awaySetScores.push({
				set_number: Number.parseInt(score.score_set, 10),
				games_won: Number.parseInt(score.score_second, 10),
			});
		}
	}

	const startTime = `${event.event_date} ${event.event_time}`;

	let winnerId: string | undefined;
	if (event.event_winner) {
		winnerId =
			event.event_winner === "First Player"
				? event.first_player_key
				: event.second_player_key;
	}

	return {
		id: event.event_key,
		start_time: startTime,
		status: mapTennisStatus(event.event_status),
		home: {
			id: event.first_player_key,
			name: event.event_first_player,
			set_scores: homeSetScores,
		},
		away: {
			id: event.second_player_key,
			name: event.event_second_player,
			set_scores: awaySetScores,
		},
		winner_id: winnerId,
		competition: {
			id: event.tournament_key,
			name: event.tournament_name,
			type: event.event_type_type,
		},
	};
}
