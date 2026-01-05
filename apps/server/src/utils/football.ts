import type {
	CompetitionGroup,
	H2HMatch,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

export function transformProxySchedule(data: any[]): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();

	data.forEach((matchData) => {
		const { tournament, homeTeam, awayTeam, status, times, date, id } =
			matchData;

		const competitionId = tournament.id;

		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: tournament.id,
					name: tournament.name,
				},
				matches: [],
			});
		}

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
			match_status: status.shortName === "FT" ? "closed" : status.shortName,
			clock: times?.currentMinute
				? {
						played: times.currentMinute.toString(),
					}
				: undefined,
		};
		competitionMap.get(competitionId)!.matches.push(match);
	});

	
	const competitions = Array.from(competitionMap.values());

	
	const total_matches = data.length;

	return { competitions, total_matches };
}

export function transformProxyMatchInfo(
	summary: import("@/types/football").ProxyMatchSummary,
	standings?: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
	h2h?: H2HMatch[],
): TransformedMatchInfo {
	console.log(summary);
	const transformed: TransformedMatchInfo = {
		competition: {
			id: summary.tournament.id.toString(),
			name: summary.tournament.name,
		},

		competitors: {
			home: {
				id: summary.homeTeam.id.toString(),
				name: summary.homeTeam.name,
				...(summary.homeTeam.score ? { score: summary.homeTeam.score.current } : { score: 0 }),
			},
			away: {
				id: summary.awayTeam.id.toString(),
				name: summary.awayTeam.name,
				...(summary.awayTeam.score ? { score: summary.awayTeam.score.current } : { score: 0 }),
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


	if (standings) {
		transformed.standings = standings;
	}
	if (top_scorers) {
		transformed.top_scorers = top_scorers;
	}
	if (h2h && h2h.length > 0) {
		transformed.h2h = h2h;
	}

	return transformed;
}

export function transformProxyStandings(
	data: import("@/types/football").ProxyStanding[],
	teamIds: string[],
): import("@/types/football").TeamStanding[] {
	if (!data || data.length === 0) return [];

	const standingGroup = data[0];
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
			goal_diff: team.average, 
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
		assists: 0, 
	}));
}

/**
 * Transform H2H data from proxy API.
 * Results are calculated relative to the current match's home/away teams.
 */
export function transformProxyH2H(
	data: any,
	homeTeamId: string,
	awayTeamId: string,
): H2HMatch[] {
	if (!data?.h2h?.results?.overall) return [];
	

	const matches = data.h2h.results.overall.slice(0, 5);

	return matches.map((match: any) => {
		const matchHomeId = match.homeTeam.id.toString();
		const homeScore = match.homeTeam.score?.current ?? 0;
		const awayScore = match.awayTeam.score?.current ?? 0;

		// Determine result for each team in this historical match
		const getResult = (teamId: string): "W" | "D" | "L" => {
			let teamScore: number;
			let opponentScore: number;

			if (teamId === matchHomeId) {
				teamScore = homeScore;
				opponentScore = awayScore;
			} else {
				teamScore = awayScore;
				opponentScore = homeScore;
			}

			if (teamScore > opponentScore) return "W";
			if (teamScore < opponentScore) return "L";
			return "D";
		};

		return {
			id: match.id.toString(),
			date: match.date,
			homeTeamResult: getResult(homeTeamId), // Result for current match's home team
			awayTeamResult: getResult(awayTeamId), // Result for current match's away team
		};
	});
}
