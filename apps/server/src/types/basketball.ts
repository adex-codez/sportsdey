export type SportRadarPlayerStatistics = {
	minutes: string;
	field_goals_made: number;
	field_goals_att: number;
	field_goals_pct: number;
	three_points_made: number;
	three_points_att: number;
	three_points_pct: number;
	free_throws_made: number;
	free_throws_att: number;
	free_throws_pct: number;
	rebounds: number;
	offensive_rebounds: number;
	defensive_rebounds: number;
	assists: number;
	steals: number;
	blocks: number;
	turnovers: number;
	personal_fouls: number;
	pls_min: number;
};

export type SportRadarPlayer = {
	full_name: string;
	played?: boolean;
	starter?: boolean;
	not_playing_reason?: string;
	statistics: SportRadarPlayerStatistics;
};

export type SportRadarTeamStatistics = {
	minutes: string;
	field_goals_made: number;
	field_goals_att: number;
	field_goals_pct: number;
	three_points_made: number;
	three_points_att: number;
	three_points_pct: number;
	free_throws_made: number;
	free_throws_att: number;
	free_throws_pct: number;
	rebounds: number;
	offensive_rebounds: number;
	defensive_rebounds: number;
	assists: number;
	steals: number;
	blocks: number;
	turnovers: number;
	personal_fouls: number;
};

export type SportRadarTeam = {
	name: string;
	market: string;
	points: number;
	scoring?: SportRadarScoring[];
	players: SportRadarPlayer[];
	statistics: SportRadarTeamStatistics;
};

export type SportRadarSeason = {
	id: string;
	year: number;
	type: string;
	name: string;
};
interface SportRadarScoring {
	number: number;
	points: number;
	type: string;
	sequence: number;
}

export interface SportRadarStreak {
	type: "win" | "loss";
	length: number;
}

export interface SportRadarStandingsTeam {
	id: string;
	name: string;
	market: string;
	wins: number;
	losses: number;
	games_back?: number;
	point_diff?: number;
	win_pct?: number;
	streak?: SportRadarStreak;
}

export interface SportRadarStandingsConference {
	name: string;
	divisions: {
		teams: SportRadarStandingsTeam[];
	}[];
}

export interface SportRadarStandingsResponse {
	conferences: SportRadarStandingsConference[];
}

export type SportRadarGameSummary = {
	id: string;
	status: string;
	season: SportRadarSeason;
	scheduled: string;
	clock: string;
	quarter: number;
	venue: {
		id: string;
		name: string;
	};
	home: SportRadarTeam;
	away: SportRadarTeam;
};
