import type { SportRadarPlayer, SportRadarTeam } from "@/types";

export function transformTeamData(teamData: SportRadarTeam) {
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
		points: teamData.points,
		starters,
		bench,
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
		},
	};
}
