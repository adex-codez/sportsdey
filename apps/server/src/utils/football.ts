import type {
	CompetitionGroup,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

export function transformProxySchedule(data: any[]): TransformedResponse {
	// Use a Map to group schedules by competition
	const competitionMap = new Map<string, CompetitionGroup>();

	// Iterate through each schedule and group by competition
	data.forEach((matchData) => {
		const { tournament, homeTeam, awayTeam, status, times, date, id } =
			matchData;

		const competitionId = tournament.id;

		// Create competition group if it doesn't exist
		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: tournament.id,
					name: tournament.name,
				},
				matches: [],
			});
		}

		// Create match object
		const match: TransformedMatch = {
			id: id,
			competitors: {
				home: {
					id: homeTeam.id,
					name: homeTeam.name,
					score: homeTeam.score?.current ?? 0,
				},
				away: {
					id: awayTeam.id,
					name: awayTeam.name,
					score: awayTeam.score?.current ?? 0,
				},
			},
			start_time: date,
			match_status: status.shortName === "FT" ? "closed" : status.shortName, // Mapping FT to closed to match previous behavior if needed, or just keep it
			clock: times?.currentMinute
				? {
						played: times.currentMinute.toString(),
					}
				: undefined,
		};
		competitionMap.get(competitionId)!.matches.push(match);
	});

	// Convert Map to array
	const competitions = Array.from(competitionMap.values());

	// Calculate total matches count
	const total_matches = data.length;

	return { competitions, total_matches };
}

export function transformProxyMatchInfo(
	summary: import("@/types/football").ProxyMatchSummary,
	standings?: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
): TransformedMatchInfo {
	const transformed: TransformedMatchInfo = {
		competition: {
			id: summary.tournament.id.toString(),
			name: summary.tournament.name,
		},

		competitors: {
			home: {
				id: summary.homeTeam.id.toString(),
				name: summary.homeTeam.name,
				score: summary.homeTeam.score.current ?? 0,
			},
			away: {
				id: summary.awayTeam.id.toString(),
				name: summary.awayTeam.name,
				score: summary.awayTeam.score.current ?? 0,
			},
		},
		match_info: {
			date_time: summary.date,
			stadium: summary.info?.stadium?.name ?? "",
		},
		status: {
			name: summary.status.name,
			shortname: summary.status.shortName,
		},
	};

	// Add clock only if status is Live? The example only showed "Full Time".
	// We'll leave it undefined for now unless we see clock data in the proxy response.

	if (standings) {
		transformed.standings = standings;
	}
	if (top_scorers) {
		transformed.top_scorers = top_scorers;
	}

	return transformed;
}

export function transformProxyStandings(
	data: import("@/types/football").ProxyStanding[],
	teamIds: string[],
): import("@/types/football").TeamStanding[] {
	if (!data || data.length === 0) return [];

	const standingGroup = data[0]; // Assuming we took the first one (Group A or similar)
	if (!standingGroup?.standings?.overall) return [];

	return standingGroup.standings.overall
		.filter((team) => teamIds.includes(team.team.id.toString()))
		.map((team) => ({
			id: team.team.id.toString(),
			name: team.team.name,
			position: team.position,
			points: team.points,
			played: team.played,
			won: team.won,
			drawn: team.draw,
			lost: team.lost,
			goals_for: team.scored,
			goals_against: team.against,
			goal_diff: team.average, // Based on user confirmation/example
		}))
		.sort((a, b) => a.position - b.position);
}

export function transformProxyTopScorers(
	data: import("@/types/football").ProxyGoalLeaderboard[],
): import("@/types/football").TopScorer[] {
	if (!data) return [];

	return data.slice(0, 3).map((player) => ({
		id: player.player.id.toString(),
		name: player.player.knownName,
		team: {
			id: player.team.id.toString(),
			name: player.team.name,
			abbreviation: player.team.shortName,
		},
		gs: player.totalGoals,
		assists: 0, // Schema has it but example doesn't.
	}));
}
