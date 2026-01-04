import { GameSummarySchema, ScheduleData, StandingsSchema } from "@/schemas";
import { z } from "@hono/zod-openapi";

// Types mimicking the proxy response structure based on user input
interface ProxyPlayerStats {
	playingTime?: string;
	totalPoints: number;
	successfulFreeThrows?: number;
	freeThrowAttempts?: number;
	freeThrowSuccessRate?: number;
	successfulFieldGoals?: number;
	fieldGoalAttempts?: number;
	fieldGoalSuccessRate?: number;
	successfulThreePointShots?: number;
	threePointShotAttempts?: number;
	threePointSuccessRate?: number;
	defensiveRebounds?: number;
	offensiveRebounds?: number;
	totalRebounds?: number;
	assists?: number;
	turnovers?: number;
	steals?: number;
	blocks?: number;
	personalFouls?: number;
	isStarting?: boolean;
	onBench?: boolean;
	dnp?: boolean;
}

interface ProxyPlayer {
	player: {
		id: number;
		knownName: string;
		shirtNumber: string;
		country: { name: string; shortName: string; id: number };
	};
	statistics: ProxyPlayerStats;
}

interface ProxyTeamBoxscore {
	boxscore: ProxyPlayer[];
	name: string;
	id: number;
}

interface ProxyGameSummary {
	id: number;
	status: { name: string; shortName: string; id: number };
	tournament: {
		name: string;
		id: number;
	};
	homeTeam: {
		id: number;
		name: string;
		score: {
			quarter1: number;
			quarter2: number;
			quarter3: number;
			quarter4: number;
			current: number;
		};
	};
	awayTeam: {
		id: number;
		name: string;
		score: {
			quarter1: number;
			quarter2: number;
			quarter3: number;
			quarter4: number;
			current: number;
		};
	};
	date: string;
	info?: {
		stadium?: {
			name: string;
		};
	};
	gameClock?: {
		minute: number;
		second: number;
	};
}

export const transformProxySchedule = (
	data: any[],
): z.infer<typeof ScheduleData> => {
	// Group games by tournament/competition
	const groupedGames = data.reduce(
		(acc, game) => {
			const tournamentName = game.tournament?.name || "Unknown Tournament";
			const tournamentId = game.tournament?.id || "unknown";

			if (!acc[tournamentId]) {
				acc[tournamentId] = {
					id: String(tournamentId),
					name: tournamentName,
					games: [],
				};
			}

			acc[tournamentId].games.push({
				id: String(game.id),
				status: mapGameStatus(game.status?.shortName),
				scheduledTime: game.startTimestamp
					? new Date(game.startTimestamp * 1000).toISOString()
					: parseDateString(game.date), // Handle DD/MM/YYYY HH:mm:ss
				home: {
					name: game.homeTeam?.name || "Unknown",
					alias: game.homeTeam?.shortName || "",
					points: game.homeTeam?.score?.current ?? null,
				},
				away: {
					name: game.awayTeam?.name || "Unknown",
					alias: game.awayTeam?.shortName || "",
					points: game.awayTeam?.score?.current ?? null,
				},
			});

			return acc;
		},
		{} as Record<string, any>,
	);

	return {
		competitions: Object.values(groupedGames),
	};
};

// Helper status mapper
const mapGameStatus = (
	statusShortName?: string,
):
	| "scheduled"
	| "closed"
	| "inprogress"
	| "halftime"
	| "postponed"
	| "cancelled" => {
	switch (statusShortName) {
		case "FT":
		case "AOT":
			return "closed";
		case "NS":
			return "scheduled";
		case "1Q":
		case "2Q":
		case "3Q":
		case "4Q":
			return "inprogress";
		case "HT":
			return "halftime";
		case "Postponed":
			return "postponed";
		case "Canceled":
			return "cancelled";
		default:
			return "scheduled"; // Default fallback
	}
};

const parseDateString = (dateStr?: string): string => {
	if (!dateStr) return new Date().toISOString();
	// Expecting "DD/MM/YYYY HH:mm:ss"
	const parts = dateStr.split(" ");
	if (parts.length < 1) return new Date().toISOString();

	const dateParts = parts[0].split("/");
	if (dateParts.length !== 3) return new Date().toISOString();

	const day = Number.parseInt(dateParts[0] || "0", 10);
	const month = Number.parseInt(dateParts[1] || "0", 10) - 1; // Months are 0-indexed in JS
	const year = Number.parseInt(dateParts[2] || "0", 10);

	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	if (parts.length > 1) {
		const timeParts = parts[1].split(":");
		if (timeParts.length >= 2) {
			hours = Number.parseInt(timeParts[0] || "0", 10);
			minutes = Number.parseInt(timeParts[1] || "0", 10);
			if (timeParts.length === 3) {
				seconds = Number.parseInt(timeParts[2] || "0", 10);
			}
		}
	}

	return new Date(
		Date.UTC(year, month, day, hours, minutes, seconds),
	).toISOString();
};

export const transformGameSummary = (
	summary: ProxyGameSummary,
	boxscore: { homeTeam: ProxyTeamBoxscore; awayTeam: ProxyTeamBoxscore },
): z.infer<typeof GameSummarySchema> => {
	const transformTeam = (
		teamSummary: ProxyGameSummary["homeTeam"],
		teamBoxscore: ProxyTeamBoxscore,
	) => {
		const starters = teamBoxscore?.boxscore
			? teamBoxscore.boxscore
					.filter((p) => !p.statistics.onBench)
					.map(transformPlayer)
			: [];

		const bench = teamBoxscore?.boxscore
			? teamBoxscore.boxscore
					.filter(
						(p) =>
							p.statistics.onBench &&
							!p.statistics.dnp &&
							p.statistics.playingTime &&
							p.statistics.playingTime !== "00:00",
					)
					.map(transformPlayer)
			: [];

		return {
			name: teamSummary.name,
			points: teamSummary.score.current,
			score: {
				quarter1: teamSummary.score.quarter1,
				quarter2: teamSummary.score.quarter2,
				quarter3: teamSummary.score.quarter3,
				quarter4: teamSummary.score.quarter4,
			},
			starters,
			bench,
		};
	};

	const transformPlayer = (p: ProxyPlayer) => ({
		full_name: p.player.knownName,
		pls_min: parseMinutes(p.statistics.playingTime),
		statistics: {
			minutes: p.statistics.playingTime || "00:00",
			field_goals_made: p.statistics.successfulFieldGoals || 0,
			field_goals_att: p.statistics.fieldGoalAttempts || 0,
			field_goals_pct: (p.statistics.fieldGoalSuccessRate || 0) * 100,
			three_points_made: p.statistics.successfulThreePointShots || 0,
			three_points_att: p.statistics.threePointShotAttempts || 0,
			three_points_pct: (p.statistics.threePointSuccessRate || 0) * 100,
			free_throws_made: p.statistics.successfulFreeThrows || 0,
			free_throws_att: p.statistics.freeThrowAttempts || 0,
			free_throws_pct: (p.statistics.freeThrowSuccessRate || 0) * 100,
			rebounds: p.statistics.totalRebounds || 0,
			offensive_rebounds: p.statistics.offensiveRebounds || 0,
			defensive_rebounds: p.statistics.defensiveRebounds || 0,
			assists: p.statistics.assists || 0,
			steals: p.statistics.steals || 0,
			blocks: p.statistics.blocks || 0,
			turnovers: p.statistics.turnovers || 0,
			personal_fouls: p.statistics.personalFouls || 0,
		},
	});

	// Helper to parse "MM:SS" into total minutes (as number)
	const parseMinutes = (timeStr?: string): number => {
		if (!timeStr) return 0;
		const parts = timeStr.split(":").map(Number);
		if (parts.length < 2) return 0;
		const [min, sec] = parts;
		if (min === undefined || sec === undefined) return 0;
		return min + sec / 60;
	};

	// Construct clock string
	let clock = "";
	if (summary.gameClock) {
		const min = summary.gameClock.minute.toString().padStart(2, "0");
		const sec = summary.gameClock.second.toString().padStart(2, "0");
		clock = `${min}:${sec}`;
	}

	return {
		id: String(summary.id),
		status: summary.status.name,
		tournament: summary.tournament,
		date: summary.date,
		venue: summary.info?.stadium?.name || "Unknown Venue",
		clock: clock,
		home: transformTeam(summary.homeTeam, boxscore?.homeTeam),
		away: transformTeam(summary.awayTeam, boxscore?.awayTeam),
	};
};

// Kept for backward compatibility
export const transformTeamData = (
	_teamData: any,
	_isHome: boolean,
	_isScheduled: boolean,
) => {
	return {};
};

export const transformProxyStandings = (
	data: any[],
): z.infer<typeof StandingsSchema> => {
	const leagueStandings =
		data.find((item) => item.name === "League Standings") || data[0];

	if (!leagueStandings || !leagueStandings.standings?.overall) {
		return { data: [] };
	}

	const transformedParams = leagueStandings.standings.overall.map(
		(teamData: any) => ({
			id: String(teamData.team.id),
			name: teamData.team.name,
			points: teamData.points,
			wins: teamData.won,
			losses: teamData.lost,
			played: teamData.played,
			// streak: 0, // Not provided in the new API response
			gb: teamData.gb,
			diff: teamData.pd, // Point differential
			win_pct: teamData.wpg,
		}),
	);

	return {
		data: transformedParams,
	};
};

export const transformGameTeamStats = (boxscore: {
	homeTeam: ProxyTeamBoxscore;
	awayTeam: ProxyTeamBoxscore;
}) => {
	const parseMinutes = (timeStr?: string): number => {
		if (!timeStr) return 0;
		const parts = timeStr.split(":").map(Number);
		if (parts.length < 2) return 0;
		const [min, sec] = parts;
		if (min === undefined || sec === undefined) return 0;
		return min + sec / 60;
	};

	const transformPlayer = (p: ProxyPlayer) => ({
		full_name: p.player.knownName,
		pls_min: parseMinutes(p.statistics.playingTime),
		statistics: {
			field_goals_made: p.statistics.successfulFieldGoals || 0,
			field_goals_att: p.statistics.fieldGoalAttempts || 0,
			field_goals_pct: (p.statistics.fieldGoalSuccessRate || 0) * 100,
			three_points_made: p.statistics.successfulThreePointShots || 0,
			three_points_att: p.statistics.threePointShotAttempts || 0,
			three_points_pct: (p.statistics.threePointSuccessRate || 0) * 100,
			free_throws_made: p.statistics.successfulFreeThrows || 0,
			free_throws_att: p.statistics.freeThrowAttempts || 0,
			free_throws_pct: (p.statistics.freeThrowSuccessRate || 0) * 100,
			rebounds: p.statistics.totalRebounds || 0,
			offensive_rebounds: p.statistics.offensiveRebounds || 0,
			defensive_rebounds: p.statistics.defensiveRebounds || 0,
			assists: p.statistics.assists || 0,
			steals: p.statistics.steals || 0,
			blocks: p.statistics.blocks || 0,
			turnovers: p.statistics.turnovers || 0,
			personal_fouls: p.statistics.personalFouls || 0,
		},
	});

	const transformTeamStats = (teamBoxscore: ProxyTeamBoxscore) => {
		const starters = teamBoxscore?.boxscore
			? teamBoxscore.boxscore
					.filter((p) => !p.statistics.onBench)
					.map(transformPlayer)
			: [];

		const bench = teamBoxscore?.boxscore
			? teamBoxscore.boxscore
					.filter(
						(p) =>
							p.statistics.onBench &&
							!p.statistics.dnp &&
							p.statistics.playingTime &&
							p.statistics.playingTime !== "00:00",
					)
					.map(transformPlayer)
			: [];

		return {
			name: teamBoxscore.name,
			starters,
			bench,
		};
	};

	return {
		home: transformTeamStats(boxscore.homeTeam),
		away: transformTeamStats(boxscore.awayTeam),
	};
};
