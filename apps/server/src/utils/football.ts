import type z from "zod";
import type { TournamentScheduleSchema } from "@/schemas";
import type {
	CompetitionGroup,
	H2HMatch,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

import { parseDateString } from ".";

export function transformProxySchedule(data: any[]): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();

	data.forEach((matchData) => {
		const { tournament, homeTeam, awayTeam, status, times, date, id } =
			matchData;
		if (status.shortName === "PSP") return;
		if (status.shortName === "CNC") return;

		const competitionId = tournament.id;

		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: tournament.id,
					name: tournament.name,
					imageUrl: tournament?.logo ?? null,
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
					imageUrl: homeTeam.logo ?? null,
				},
				away: {
					id: awayTeam.id,
					name: awayTeam.name,
					score: awayTeam.score?.current ?? 0,
					imageUrl: awayTeam.logo ?? null,
				},
			},
			start_time: parseDateString(date),
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
		"Italian Serie A",
		"French Ligue 1",
		"UEFA Europa League",
		"Carabao Cup",
		"Copa del Rey",
	];

	competitions.sort((a, b) => {
		const aName = a.competition.name;
		const bName = b.competition.name;

		const aIndex = priorityLeagues.findIndex((league) => aName === league);
		const bIndex = priorityLeagues.findIndex((league) => bName === league);

		if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		if (aIndex !== -1) return -1;
		if (bIndex !== -1) return 1;

		return aName.localeCompare(bName);
	});

	const total_matches = data.length;

	return { competitions, total_matches };
}

export function transformTournamentSchedule(
	data: any[],
): z.infer<typeof TournamentScheduleSchema> {
	const matches = data.map((matchData) => {
		const { homeTeam, awayTeam, status, times, date, id } = matchData;

		return {
			id: id,
			competitors: {
				home: {
					id: homeTeam.id,
					name: homeTeam.name,
					score: homeTeam.score?.current ?? 0,
					imageUrl: homeTeam.logo ?? null,
				},
				away: {
					id: awayTeam.id,
					name: awayTeam.name,
					score: awayTeam.score?.current ?? 0,
					imageUrl: awayTeam.logo ?? null,
				},
			},
			start_time: parseDateString(date),
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
		imageUrl: data[0].tournament.logo ?? null,
	};
	return { matches, total_matches: matches.length, competition };
}

export function transformSchedule(
	data: ApiSportsFixture[],
): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();

	data.forEach((matchData) => {
		const { fixture, league, teams, goals } = matchData;
		if (fixture.status.short === "C" || fixture.status.short === "P") return;

		const competitionId = league.name;

		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: league.id.toString(),
					name: league.name,
					imageUrl: league.logo ?? null,
				},
				matches: [],
			});
		}

		const match: TransformedMatch = {
			id: fixture.id.toString(),
			competitors: {
				home: {
					id: teams.home.id.toString(),
					name: teams.home.name,
					score: goals.home ?? 0,
					imageUrl: teams.home.logo ?? null,
				},
				away: {
					id: teams.away.id.toString(),
					name: teams.away.name,
					score: goals.away ?? 0,
					imageUrl: teams.away.logo ?? null,
				},
			},
			start_time: fixture.date,
			match_status: mapStatus(fixture.status.short),
			...(fixture.status.elapsed
				? {
						clock: fixture.status.elapsed,
					}
				: {}),
		};
		competitionMap.get(competitionId)!.matches.push(match);
	});

	const competitions = Array.from(competitionMap.values());

	const priorityLeagues: Record<string, number> = {
		"UEFA Champions League": 0,
		"Premier League": 1,
		LaLiga: 2,
		"La Liga": 2,
		"Segunda División": 3,
		"Serie A": 4,
		"Ligue 1": 5,
		Bundesliga: 6,
		"UEFA Europa League": 7,
		"UEFA Nations League": 8,
		"Copa del Rey": 9,
		"FA Cup": 10,
		"EFL Cup": 11,
		"African Cup of Nations": 12,
		"Premier League (Nigeria)": 13,
		"Premier League (Egypt)": 14,
		"Premier League (South Africa)": 15,
	};

	competitions.sort((a, b) => {
		const aName = a.competition.name;
		const bName = b.competition.name;

		const aPriority = priorityLeagues[aName] ?? 999;
		const bPriority = priorityLeagues[bName] ?? 999;

		if (aPriority !== 999 && bPriority !== 999) return aPriority - bPriority;
		if (aPriority !== 999) return -1;
		if (bPriority !== 999) return 1;

		return aName.localeCompare(bName);
	});

	const total_matches = data.length;

	return { competitions, total_matches };
}

export interface ApiSportsMatchResponse {
	response: {
		fixture: {
			id: number;
			date: string;
			timestamp: number;
			timezone: string;
			periods: { first: number | null; second: number | null };
			venue: { id: number; name: string; city: string } | null;
			status: { long: string; short: string; elapsed: number | null };
		};
		league: {
			id: number;
			name: string;
			country: string;
			logo: string;
			flag: string;
			season: number;
			round: string;
		};
		teams: {
			home: { id: number; name: string; logo: string; winner: boolean | null };
			away: { id: number; name: string; logo: string; winner: boolean | null };
		};
		goals: { home: number | null; away: number | null };
		score: {
			halftime: { home: number | null; away: number | null };
			fulltime: { home: number | null; away: number | null };
			extratime: { home: number | null; away: number | null };
			penalty: { home: number | null; away: number | null };
		};
	}[];
}

export function transformMatch(
	data: ApiSportsMatchResponse,
	standings?: import("@/types/football").TeamStanding[],
	top_scorers?: import("@/types/football").TopScorer[],
	h2h?: { homeH2H: H2HMatch[]; awayH2H: H2HMatch[] },
): TransformedMatchInfo {
	const match = data.response[0];

	if (!match) {
		throw new Error("Match not found");
	}

	const { fixture, league, teams, goals } = match;
	const mappedStatus = mapStatus(fixture.status.short);

	const transformed: TransformedMatchInfo = {
		competition: {
			id: league.id.toString(),
			name: league.name,
			imageUrl: league.logo ?? null,
		},
		competitors: {
			home: {
				id: teams.home.id.toString(),
				name: teams.home.name,
				shortName: teams.home.name.substring(0, 3).toUpperCase(),
				score: goals.home ?? 0,
				imageUrl: teams.home.logo ?? null,
			},
			away: {
				id: teams.away.id.toString(),
				name: teams.away.name,
				shortName: teams.away.name.substring(0, 3).toUpperCase(),
				score: goals.away ?? 0,
				imageUrl: teams.away.logo ?? null,
			},
		},
		match_info: {
			date_time: fixture.date,
			stadium: fixture.venue?.name ?? "",
		},
		...(fixture.status.elapsed ? { clock: fixture.status.elapsed } : {}),
		status: {
			name: fixture.status.long,
			shortname: mappedStatus,
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
				shortName: summary.homeTeam.shortName,
				...(summary.homeTeam.score
					? { score: summary.homeTeam.score.current }
					: { score: 0 }),
			},
			away: {
				id: summary.awayTeam.id.toString(),
				name: summary.awayTeam.name,
				shortName: summary.awayTeam.shortName,
				...(summary.awayTeam.score
					? { score: summary.awayTeam.score.current }
					: { score: 0 }),
			},
		},
		match_info: {
			date_time: summary.date,
			stadium: summary.info?.stadium?.name ?? "",
		},
		...(summary.times ? { clock: summary.times?.currentMinute } : {}),
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

export interface ApiSportsStandingsResponse {
	response: {
		league: {
			id: number;
			name: string;
			country: string;
			logo: string;
			flag: string;
			season: number;
		};
		leagueStandings: {
			rank: number;
			team: { id: number; name: string; logo: string };
			points: number;
			played: number;
			won: number;
			draw: number;
			lost: number;
			goalsfor: number;
			goalsagainst: number;
			goalsdiff: number;
		}[];
	}[];
}

export function transformStandings(
	data: ApiSportsStandingsResponse | Record<string, never>,
	teamIds: string[],
): import("@/types/football").TeamStanding[] {
	if (!data?.response || data.response.length === 0) return [];

	const leagueData = data.response[0];
	if (!leagueData?.leagueStandings) return [];

	return leagueData.leagueStandings
		.filter((team) => teamIds.includes(team.team.id.toString()))
		.map((team) => ({
			id: team.team.id.toString(),
			name: team.team.name,
			position: team.rank,
			points: team.points,
			imageUrl: team.team.logo ?? null,
			played: team.played,
			won: team.won,
			drawn: team.draw,
			lost: team.lost,
			goals_for: team.goalsfor,
			goals_against: team.goalsagainst,
			goal_diff: team.goalsdiff,
		}))
		.sort((a, b) => a.position - b.position);
}

export interface ApiSportsTopScorersResponse {
	response: {
		player: {
			id: number;
			name: string;
			firstname: string;
			lastname: string;
			age: number | null;
			nationality: string;
			photo: string;
		};
		statistics: {
			team: { id: number; name: string; logo: string };
			league: { id: number; name: string };
			goals: { total: number | null };
		}[];
	}[];
}

export function transformTopScorers(
	data: ApiSportsTopScorersResponse | null,
): import("@/types/football").TopScorer[] {
	if (!data?.response) return [];

	return data.response.slice(0, 3).map((player) => ({
		id: player.player.id.toString(),
		name: player.player.name,
		imageUrl: player.player.photo ?? null,
		team: {
			id: player.statistics[0]?.team?.id?.toString() ?? "",
			name: player.statistics[0]?.team?.name ?? "",
			abbreviation:
				player.statistics[0]?.team?.name?.substring(0, 3).toUpperCase() ?? "",
			imageUrl: player.statistics[0]?.team?.logo ?? null,
		},
		gs: player.statistics[0]?.goals?.total ?? 0,
	}));
}

export function transformFullStandings(
	data: ApiSportsStandingsResponse,
): import("@/types/football").FullStandingsResponse {
	console.log("transformFullStandings input:", JSON.stringify(data));

	if (!data?.response || data.response.length === 0) {
		return {
			tournament: { id: 0, name: "Unknown" },
			standings: [],
		};
	}

	const leagueData = data.response[0];
	if (!leagueData) {
		return {
			tournament: { id: 0, name: "Unknown" },
			standings: [],
		};
	}
	const league = leagueData.league;

	const standings = (leagueData.leagueStandings || []).map((team) => ({
		name: team.team.name,
		position: team.rank,
		imageUrl: team.team.logo ?? null,
		statistics: {
			P: team.played,
			W: team.won,
			D: team.draw,
			L: team.lost,
			GD: team.goalsdiff,
			PTS: team.points,
		},
	}));

	return {
		tournament: {
			id: league.id,
			name: league.name,
		},
		standings,
	};
}

export interface ApiSportsMatchStatsResponse {
	response: {
		fixture: {
			id: number;
			date: string;
			timestamp: number;
			status: { short: string };
		};
		league: { id: number; name: string };
		teams: {
			home: { id: number; name: string; logo: string; winner: boolean | null };
			away: { id: number; name: string; logo: string; winner: boolean | null };
		};
		statistics: {
			ballPossession: { percentage: number | null };
			shots: { total: number | null; onGoal: number | null };
			fouls: { total: number | null };
			corners: { total: number | null };
			offsides: { total: number | null };
			saves: { total: number | null };
			yellowCards: { total: number | null };
			redCards: { total: number | null };
		}[];
	}[];
}

export function transformMatchStats(data: ApiSportsMatchStatsResponse): any {
	const match = data.response?.[0];

	if (!match) {
		return null;
	}

	const homeStats = match.statistics?.[0];
	const awayStats = match.statistics?.[1];

	const getStat = (stats: any, type: string): number => {
		if (!stats) return 0;
		const stat = stats[type];
		if (!stat) return 0;
		if (type === "shots") {
			return stat.onGoal ?? 0;
		}
		return stat.total ?? 0;
	};

	return {
		home: {
			statistics: {
				ballPossession: homeStats?.ballPossession?.percentage ?? 0,
				shotsOnTarget: getStat(homeStats, "shots"),
				shotsOffTarget:
					(homeStats?.shots?.total ?? 0) - getStat(homeStats, "shots"),
				fouls: getStat(homeStats, "fouls"),
				corners: getStat(homeStats, "corners"),
				offsides: getStat(homeStats, "offsides"),
				saves: getStat(homeStats, "saves"),
				yellowCards: getStat(homeStats, "yellowCards"),
				secondYellowCards: 0,
				redCards: getStat(homeStats, "redCards"),
			},
			name: match.teams.home.name,
			id: match.teams.home.id,
			imageUrl: match.teams.home.logo ?? null,
		},
		away: {
			statistics: {
				ballPossession: awayStats?.ballPossession?.percentage ?? 0,
				shotsOnTarget: getStat(awayStats, "shots"),
				shotsOffTarget:
					(awayStats?.shots?.total ?? 0) - getStat(awayStats, "shots"),
				fouls: getStat(awayStats, "fouls"),
				corners: getStat(awayStats, "corners"),
				offsides: getStat(awayStats, "offsides"),
				saves: getStat(awayStats, "saves"),
				yellowCards: getStat(awayStats, "yellowCards"),
				secondYellowCards: 0,
				redCards: getStat(awayStats, "redCards"),
			},
			name: match.teams.away.name,
			id: match.teams.away.id,
			imageUrl: match.teams.away.logo ?? null,
		},
		date: match.fixture.date,
		id: match.fixture.id,
	};
}

export interface ApiSportsH2HResponse {
	response: {
		fixture: {
			id: number;
			date: string;
			timestamp: number;
			status: { short: string };
		};
		league: {
			id: number;
			name: string;
			country: string;
			logo: string;
			flag: string;
		};
		teams: {
			home: { id: number; name: string; logo: string; winner: boolean | null };
			away: { id: number; name: string; logo: string; winner: boolean | null };
		};
		goals: { home: number | null; away: number | null };
	}[];
}

export function transformH2H(
	data: ApiSportsH2HResponse | null,
	homeTeamId: string,
	awayTeamId: string,
): { homeH2H: H2HMatch[]; awayH2H: H2HMatch[] } {
	if (!data?.response || data.response.length === 0) {
		return { homeH2H: [], awayH2H: [] };
	}

	const matches = data.response.slice(0, 5);

	const getResult = (teamId: string, match: any): "W" | "D" | "L" => {
		const matchHomeId = match.teams.home.id.toString();
		const homeScore = match.goals.home ?? 0;
		const awayScore = match.goals.away ?? 0;

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

	const homeH2H: H2HMatch[] = matches.map((match) => ({
		id: match.fixture.id.toString(),
		date: match.fixture.date,
		result: getResult(homeTeamId, match),
	}));

	const awayH2H: H2HMatch[] = matches.map((match) => ({
		id: match.fixture.id.toString(),
		date: match.fixture.date,
		result: getResult(awayTeamId, match),
	}));

	return { homeH2H, awayH2H };
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

export function transformFullProxyStandings(
	data: any[],
): import("@/types/football").FullStandingsResponse {
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

function mapStatus(status: string): string {
	if (status === "FT") return "closed";
	if (status === "NS") return "SCH";
	if (status === "IN") return "LIVE";
	if (status === "HT") return "HT";
	if (status === "1H") return "1H";
	if (status === "2H") return "2H";
	if (status === "ET") return "ET";
	if (status === "P") return "PPD";
	if (status === "C") return "CNC";
	if (status === "A") return "ABD";
	return "SCH";
}

interface ApiSportsFixture {
	fixture: {
		id: number;
		date: string;
		timestamp: number;
		timezone: string;
		periods: {
			first: number | null;
			second: number | null;
		};
		venue: {
			id: number;
			name: string;
			city: string;
		} | null;
		status: {
			long: string;
			short: string;
			elapsed: number | null;
		};
	};
	league: {
		id: number;
		name: string;
		country: string;
		logo: string;
		flag: string;
		season: number;
		round: string;
	};
	teams: {
		home: {
			id: number;
			name: string;
			logo: string;
			winner: boolean | null;
		};
		away: {
			id: number;
			name: string;
			logo: string;
			winner: boolean | null;
		};
	};
	goals: {
		home: number | null;
		away: number | null;
	};
}

// export function transformTournamentSchedule(
// 	data: StatscoreApiResponse,
// 	tournamentId: string,
// ): z.infer<typeof TournamentScheduleSchema> {
// 	const allMatches: TransformedMatch[] = [];
// 	let competitionName = "Unknown Competition";

// 	const competitions = data.api?.data?.competitions || [];

// 	competitions.forEach((comp) => {
// 		if (comp.id.toString() !== tournamentId) return;

// 		competitionName = comp.name;

// 		comp.seasons.forEach((season) => {
// 			season.stages.forEach((stage) => {
// 				stage.groups.forEach((group) => {
// 					group.events.forEach((event) => {
// 						if (event.status_name === "Postponed") return;
// 						if (event.status_name === "Cancelled") return;

// 						const homeParticipant = event.participants.find(
// 							(p) => p.counter === 1,
// 						);
// 						const awayParticipant = event.participants.find(
// 							(p) => p.counter === 2,
// 						);

// 						const match: TransformedMatch = {
// 							id: event.id.toString(),
// 							competitors: {
// 								home: {
// 									id: homeParticipant?.id.toString() || "",
// 									name:
// 										homeParticipant?.short_name || homeParticipant?.name || "",
// 									score: homeParticipant
// 										? getParticipantScore(homeParticipant)
// 										: 0,
// 								},
// 								away: {
// 									id: awayParticipant?.id.toString() || "",
// 									name:
// 										awayParticipant?.short_name || awayParticipant?.name || "",
// 									score: awayParticipant
// 										? getParticipantScore(awayParticipant)
// 										: 0,
// 								},
// 							},
// 							start_time: parseStatscoreDate(event.start_date),
// 							match_status: mapStatscoreStatus(
// 								event.status_id,
// 								event.status_type,
// 							),
// 						};

// 						allMatches.push(match);
// 					});
// 				});
// 			});
// 		});
// 	});

// 	return {
// 		matches: allMatches,
// 		total_matches: allMatches.length,
// 		competition: {
// 			id: Number.parseInt(tournamentId, 10),
// 			name: competitionName,
// 		},
// 	};
// }
