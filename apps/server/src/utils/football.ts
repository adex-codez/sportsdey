import type { TournamentScheduleSchema } from "@/schemas";
import type {
	CompetitionGroup,
	H2HMatch,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";
import type z from "zod";

export function transformProxySchedule(data: any[]): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();

	data.forEach((matchData) => {
		const { tournament, homeTeam, awayTeam, status, times, date, id } =
			matchData;
		if(status.shortName === "PSP") return;
if(status.shortName === "CNC") return;

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
			...(times?.currentMinute
				? {
						clock: times.currentMinute,
					}
				: {}),
		};
		competitionMap.get(competitionId)!.matches.push(match);
	});

	const competitions = Array.from(competitionMap.values());

	// Sort competitions to show major leagues first
	const priorityLeagues = [
		"Champions League",
		"English Premier League",
		"Spanish La Liga",
		"Spanish La Liga 2",
		"African Cup of Nations",
		"Serie A",
		"French Ligue 1",
	];

	competitions.sort((a, b) => {
		const aName = a.competition.name;
		const bName = b.competition.name;

		const aIndex = priorityLeagues.findIndex((league) =>
			aName === league,
		);
		const bIndex = priorityLeagues.findIndex((league) =>
			bName === league,
		);

		if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		if (aIndex !== -1) return -1;
		if (bIndex !== -1) return 1;

		return aName.localeCompare(bName);
	});

	const total_matches = data.length;

	return { competitions, total_matches };
}

export function transformProxyMatchInfo(
	summary: import("@/types/football").ProxyMatchSummary,
	standings?: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
	h2h?: { homeH2H: H2HMatch[]; awayH2H: H2HMatch[] },
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
				...(summary.homeTeam.score
					? { score: summary.homeTeam.score.current }
					: { score: 0 }),
			},
			away: {
				id: summary.awayTeam.id.toString(),
				name: summary.awayTeam.name,
				...(summary.awayTeam.score
					? { score: summary.awayTeam.score.current }
					: { score: 0 }),
			},
		},
		match_info: {
			date_time: summary.date,
			stadium: summary.info?.stadium?.name ?? "",
		},
		...(summary.times ? {clock: summary.times?.currentMinute} : {}),
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
	if (h2h) {
		if (h2h.homeH2H.length > 0) {
			transformed.homeH2H = h2h.homeH2H;
		}
		if (h2h.awayH2H.length > 0) {
			transformed.awayH2H = h2h.awayH2H;
		}
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
	}));
}

/**
 * Transform H2H data from proxy API.
 * Returns separate arrays for home and away teams.
 */
export function transformProxyH2H(
	data: any,
	homeTeamId: string,
	awayTeamId: string,
): { homeH2H: H2HMatch[]; awayH2H: H2HMatch[] } {
	if (!data?.h2h?.results?.overall) return { homeH2H: [], awayH2H: [] };

	const matches = data.h2h.results.overall.slice(0, 5);

	const getResult = (teamId: string, match: any): "win" | "draw" | "loss" => {
		const matchHomeId = match.homeTeam.id.toString();
		const homeScore = match.homeTeam.score?.current ?? 0;
		const awayScore = match.awayTeam.score?.current ?? 0;

		let teamScore: number;
		let opponentScore: number;

		if (teamId === matchHomeId) {
			teamScore = homeScore;
			opponentScore = awayScore;
		} else {
			teamScore = awayScore;
			opponentScore = homeScore;
		}

		if (teamScore > opponentScore) return "win";
		if (teamScore < opponentScore) return "loss";
		return "draw";
	};

	const homeH2H: H2HMatch[] = matches.map((match: any) => ({
		id: match.id.toString(),
		name: data.homeTeam.name,
		date: match.date,
		result: getResult(homeTeamId, match),
	}));

	const awayH2H: H2HMatch[] = matches.map((match: any) => ({
		id: match.id.toString(),
		name: data.awayTeam.name,
		date: match.date,
		result: getResult(awayTeamId, match),
	}));

	return { homeH2H, awayH2H };
}

export function transformProxyStats(
	data: import("@/types/football").ProxyMatchStats,
): import("@/types/football").TransformedMatchStats {
	return {
		home: {
			statistics: data.homeTeam.statistics,
			name: data.homeTeam.name,
			id: data.homeTeam.id,
		},
		away: {
			statistics: data.awayTeam.statistics,
			name: data.awayTeam.name,
			id: data.awayTeam.id,
		},
		date: data.date,
		id: data.id,
	};
}

export function transformFullProxyStandings(data: any[]): import("@/types/football").FullStandingsResponse {
	if (!data || data.length === 0) {
		throw new Error("No standings data available");
	}

	const tournamentData = data[0];
	const tournament = {
		id: tournamentData.tournament.id,
		name: tournamentData.tournament.name,
	};

	const overallStandings = tournamentData.standings?.overall || [];

	const standings = overallStandings.map((item: any) => ({
		name: item.team.name,
		position: item.position,
		statistics: {
			P: item.played,
			W: item.won,
			D: item.draw,
			L: item.lost,
			GD: item.average,
			PTS: item.points,
		},
	}));

	return {
		tournament,
		standings,
	};
}

export function transformTournamentSchedule(data: any[]): z.infer<typeof TournamentScheduleSchema> {
	const matches = data.map((matchData) => {
		const { homeTeam, awayTeam, status, times, date, id } = matchData;

		return {
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
			date: date,
			match_status: status.shortName === "FT" ? "closed" : status.shortName,
			...(times?.currentMinute
				? {
						clock: times.currentMinute,
					}
				: {}),
		};
	});
	
	const competition = {
		name: data[0].tournament.name,
		id: data[0].tournament.id,
	}
	return { matches, total_matches: matches.length, competition };
}
