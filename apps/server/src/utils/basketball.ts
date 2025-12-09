import type { SportRadarPlayer, SportRadarTeam } from "@/types";

export function transformTeamData(
	teamData: SportRadarTeam,
	skipPoints: boolean,
	isScheduled: boolean
) {
	if(isScheduled){
return {
		name: `${teamData.market} ${teamData.name}`,
		...(skipPoints ? {} : { points: teamData.points }),
	};
	}
	const activePlayers = teamData.players.filter(
		(player: SportRadarPlayer) => !player.not_playing_reason,
	);

	const starters = activePlayers
		.filter((player: SportRadarPlayer) => player.played && player.starter)
		.map(transformPlayer);

	const bench = activePlayers
		.filter((player: SportRadarPlayer) => player.played && !player.starter)
		.map(transformPlayer);

	return {
		name: `${teamData.market} ${teamData.name}`,
		...(skipPoints ? {} : { points: teamData.points }),
		...transformTeamStatistics(teamData),
		starters,
		bench,
	};
}

export function transformTeamStatistics(teamData: SportRadarTeam) {
	return {
		statistics: {
			field_goals_made: teamData.statistics?.field_goals_made || 0,
			field_goals_att: teamData.statistics?.field_goals_att || 0,
			field_goals_pct: teamData.statistics?.field_goals_pct || 0,
			three_points_made: teamData.statistics?.three_points_made || 0,
			three_points_att: teamData.statistics?.three_points_att || 0,
			three_points_pct: teamData.statistics?.three_points_pct || 0,
			free_throws_made: teamData.statistics?.free_throws_made || 0,
			free_throws_att: teamData.statistics?.free_throws_att || 0,
			free_throws_pct: teamData.statistics?.free_throws_pct || 0,
			rebounds: teamData.statistics?.rebounds || 0,
			offensive_rebounds: teamData.statistics?.offensive_rebounds || 0,
			defensive_rebounds: teamData.statistics?.defensive_rebounds || 0,
			assists: teamData.statistics?.assists || 0,
			steals: teamData.statistics?.steals || 0,
			blocks: teamData.statistics?.blocks || 0,
			turnovers: teamData.statistics?.turnovers || 0,
		},
	};
}

export function transformPlayer(player: SportRadarPlayer) {
	return {
		full_name: player.full_name,
		statistics: {
			field_goals_made: player.statistics?.field_goals_made || 0,
			pls_min: player.statistics?.pls_min || 0,
			field_goals_att: player.statistics?.field_goals_att || 0,
			field_goals_pct: player.statistics?.field_goals_pct || 0,
			three_points_made: player.statistics?.three_points_made || 0,
			three_points_att: player.statistics?.three_points_att || 0,
			three_points_pct: player.statistics?.three_points_pct || 0,
			free_throws_made: player.statistics?.free_throws_made || 0,
			free_throws_att: player.statistics?.free_throws_att || 0,
			free_throws_pct: player.statistics?.free_throws_pct || 0,
			rebounds: player.statistics?.rebounds || 0,
			offensive_rebounds: player.statistics?.offensive_rebounds || 0,
			defensive_rebounds: player.statistics?.defensive_rebounds || 0,
			assists: player.statistics?.assists || 0,
			steals: player.statistics?.steals || 0,
			blocks: player.statistics?.blocks || 0,
			turnovers: player.statistics?.turnovers || 0,
			personal_fouls: player.statistics?.personal_fouls || 0,
			minutes_played: player.statistics?.minutes || 0,
		},
	};
}
