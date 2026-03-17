import type z from "zod";
import type { TournamentScheduleSchema } from "@/schemas/football";
import type {
	CompetitionGroup,
	H2HMatch,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

import { parseDateString } from ".";

export function transformSchedule(
	data: ApiSportsFixture[],
): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();

	data.forEach((matchData) => {
		const { fixture, league, teams, goals } = matchData;
		if (fixture.status.short === "C" || fixture.status.short === "P") return;

		const competitionId = `${league.id}`;

		if (!competitionMap.has(competitionId)) {
			competitionMap.set(competitionId, {
				competition: {
					id: league.id.toString(),
					name: league.name,
					imageUrl: league.logo ?? null,
					country: {
						name: league.country ?? null,
						flag: league.flag ?? null,
					},
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
		"Serie A": 3,
		Bundesliga: 4,
		"Ligue 1": 5,
		"UEFA Europa League": 6,
		"UEFA Nations League": 7,
		"FA Cup": 8,
		"Copa del Rey": 9,
		"EFL Cup": 10,
		"Segunda División": 11,
		"African Cup of Nations": 12,
	};

	const resolvePriority = (comp?: CompetitionGroup["competition"]): number => {
		if (!comp) return 999;

		const name = comp.name;
		const country = comp.country?.name ?? "";

		// Only the English Premier League should receive the "Premier League" priority.
		if (name === "Premier League") {
			return country === "England"
				? priorityLeagues["Premier League"]
				: 999;
		}

		return priorityLeagues[name] ?? 999;
	};

	competitions.sort((a, b) => {
		const aPriority: number = resolvePriority(a?.competition);
		const bPriority: number = resolvePriority(b?.competition);

		if (aPriority !== 999 && bPriority !== 999) return aPriority - bPriority;
		if (aPriority !== 999) return -1;
		if (bPriority !== 999) return 1;

		const aName = a.competition?.name ?? "";
		const bName = b.competition?.name ?? "";
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
			country: {
				name: league.country,
				flag: league.flag ?? null,
			},
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

export interface ApiSportsStandingsResponse {
	response: {
		league: {
			id: number;
			name: string;
			country: string;
			logo: string;
			flag: string;
			season: number;
			standings: Array<
				Array<{
					rank: number;
					team: { id: number; name: string; logo: string };
					points: number;
					goalsDiff: number;
					group: string;
					all: {
						played: number;
						win: number;
						draw: number;
						lose: number;
						goals: { for: number; against: number };
					};
				}>
			>;
		};
	}[];
}

export function transformStandings(
	data: ApiSportsStandingsResponse | Record<string, never>,
	teamIds: string[],
): import("@/types/football").TeamStanding[] {
	if (!data?.response || data.response.length === 0) return [];

	const leagueData = data.response[0];
	const standings = leagueData?.league?.standings?.[0];
	if (!standings) return [];

	return standings
		.filter((team) => teamIds.includes(team.team.id.toString()))
		.map((team) => ({
			id: team.team.id.toString(),
			name: team.team.name,
			position: team.rank,
			points: team.points,
			imageUrl: team.team.logo ?? null,
			played: team.all.played,
			won: team.all.win,
			drawn: team.all.draw,
			lost: team.all.lose,
			goals_for: team.all.goals.for,
			goals_against: team.all.goals.against,
			goal_diff: team.goalsDiff,
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
	const standingsData = league?.standings?.[0] || [];

	const standings = standingsData.map((team) => ({
		name: team.team.name,
		position: team.rank,
		imageUrl: team.team.logo ?? null,
		statistics: {
			P: team.all.played,
			W: team.all.win,
			D: team.all.draw,
			L: team.all.lose,
			GD: team.goalsDiff,
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
		logo: string;
		season: number;
		round: string;
		country: string;
		flag: string;
	};
	country: {
		name: string;
		flag: string;
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
