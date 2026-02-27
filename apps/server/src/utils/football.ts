import type z from "zod";
import type { TournamentScheduleSchema } from "@/schemas";
import type {
	CompetitionGroup,
	H2HMatch,
	TransformedMatch,
	TransformedMatchInfo,
	TransformedResponse,
} from "@/types/football";

interface StatscoreEvent {
	id: number;
	name: string;
	start_date: string;
	status_id: number;
	status_name: string;
	status_type: string;
	participants: {
		counter: number;
		id: number;
		name: string;
		short_name: string;
		results: { id: number; value: string }[];
	}[];
}

interface StatscoreGroup {
	events: StatscoreEvent[];
}

interface StatscoreStage {
	groups: StatscoreGroup[];
}

interface StatscoreSeason {
	stages: StatscoreStage[];
}

interface StatscoreCompetition {
	id: number;
	name: string;
	short_name: string;
	area_name: string;
	seasons: StatscoreSeason[];
}

interface StatscoreApiResponse {
	api: {
		data: {
			competitions: StatscoreCompetition[];
		};
	};
}

function mapStatscoreStatus(_statusId: number, statusType: string): string {
	if (statusType === "finished") return "closed";
	if (statusType === "in_progress") return "LIVE";
	if (statusType === "scheduled") return "SCH";
	if (statusType === "postponed") return "PPD";
	if (statusType === "cancelled") return "CNC";
	if (statusType === "halftime") return "HT";
	if (statusType === "1h") return "1H";
	if (statusType === "2h") return "2H";
	return "SCH";
}

function getParticipantScore(
	participant: StatscoreEvent["participants"][number],
): number {
	const result = participant.results.find((r) => r.id === 2);
	if (result && result.value) {
		const score = Number.parseInt(result.value, 10);
		return isNaN(score) ? 0 : score;
	}
	return 0;
}

function parseStatscoreDate(dateStr: string): string {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) {
		return new Date().toISOString();
	}
	return date.toISOString();
}

export function transformSchedule(
	data: StatscoreApiResponse,
): TransformedResponse {
	const competitionMap = new Map<string, CompetitionGroup>();
	const competitions = data.api?.data?.competitions || [];

	competitions.forEach((comp) => {
		comp.seasons.forEach((season) => {
			season.stages.forEach((stage) => {
				stage.groups.forEach((group) => {
					group.events.forEach((event) => {
						if (event.status_name === "Postponed") return;
						if (event.status_name === "Cancelled") return;

						const competitionId = comp.id.toString();

						if (!competitionMap.has(competitionId)) {
							competitionMap.set(competitionId, {
								competition: {
									id: competitionId,
									name: comp.name,
								},
								matches: [],
							});
						}

						const homeParticipant = event.participants.find(
							(p) => p.counter === 1,
						);
						const awayParticipant = event.participants.find(
							(p) => p.counter === 2,
						);

						const match: TransformedMatch = {
							id: event.id.toString(),
							competitors: {
								home: {
									id: homeParticipant?.id.toString() || "",
									name:
										homeParticipant?.short_name || homeParticipant?.name || "",
									score: homeParticipant
										? getParticipantScore(homeParticipant)
										: 0,
								},
								away: {
									id: awayParticipant?.id.toString() || "",
									name:
										awayParticipant?.short_name || awayParticipant?.name || "",
									score: awayParticipant
										? getParticipantScore(awayParticipant)
										: 0,
								},
							},
							start_time: parseStatscoreDate(event.start_date),
							match_status: mapStatscoreStatus(
								event.status_id,
								event.status_type,
							),
						};

						competitionMap.get(competitionId)!.matches.push(match);
					});
				});
			});
		});
	});

	const resultCompetitions = Array.from(competitionMap.values());

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

	resultCompetitions.sort((a, b) => {
		const aName = a.competition.name;
		const bName = b.competition.name;

		const aIndex = priorityLeagues.findIndex((league) => aName === league);
		const bIndex = priorityLeagues.findIndex((league) => bName === league);

		if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
		if (aIndex !== -1) return -1;
		if (bIndex !== -1) return 1;

		return aName.localeCompare(bName);
	});

	const total_matches = resultCompetitions.reduce(
		(acc, comp) => acc + comp.matches.length,
		0,
	);

	return { competitions: resultCompetitions, total_matches };
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

export function transformTournamentSchedule(
	data: StatscoreApiResponse,
	tournamentId: string,
): z.infer<typeof TournamentScheduleSchema> {
	const allMatches: TransformedMatch[] = [];
	let competitionName = "Unknown Competition";

	const competitions = data.api?.data?.competitions || [];

	competitions.forEach((comp) => {
		if (comp.id.toString() !== tournamentId) return;

		competitionName = comp.name;

		comp.seasons.forEach((season) => {
			season.stages.forEach((stage) => {
				stage.groups.forEach((group) => {
					group.events.forEach((event) => {
						if (event.status_name === "Postponed") return;
						if (event.status_name === "Cancelled") return;

						const homeParticipant = event.participants.find(
							(p) => p.counter === 1,
						);
						const awayParticipant = event.participants.find(
							(p) => p.counter === 2,
						);

						const match: TransformedMatch = {
							id: event.id.toString(),
							competitors: {
								home: {
									id: homeParticipant?.id.toString() || "",
									name:
										homeParticipant?.short_name || homeParticipant?.name || "",
									score: homeParticipant
										? getParticipantScore(homeParticipant)
										: 0,
								},
								away: {
									id: awayParticipant?.id.toString() || "",
									name:
										awayParticipant?.short_name || awayParticipant?.name || "",
									score: awayParticipant
										? getParticipantScore(awayParticipant)
										: 0,
								},
							},
							start_time: parseStatscoreDate(event.start_date),
							match_status: mapStatscoreStatus(
								event.status_id,
								event.status_type,
							),
						};

						allMatches.push(match);
					});
				});
			});
		});
	});

	return {
		matches: allMatches,
		total_matches: allMatches.length,
		competition: {
			id: Number.parseInt(tournamentId, 10),
			name: competitionName,
		},
	};
}
