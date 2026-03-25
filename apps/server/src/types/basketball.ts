export type ScheduleData = {
	competitions: {
		id: string;
		name: string;
		imageUrl?: string | null;
		country?: {
			name: string;
			flag?: string | null;
		};
		games: ScheduledGame[];
	}[];
};

export type ScheduledGame = {
	id: string;
	status:
		| "scheduled"
		| "created"
		| "inprogress"
		| "halftime"
		| "complete"
		| "closed"
		| "cancelled"
		| "delayed"
		| "postponed"
		| "time-tbd"
		| "if-necessary"
		| "unnecessary";
	scheduledTime: string;
	home: {
		name: string;
		alias: string;
		points: number | null;
		imageUrl?: string | null;
	};
	away: {
		name: string;
		alias: string;
		points: number | null;
		imageUrl?: string | null;
	};
	clock?: string;
};

export type PlayerStatistics = {
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

export type Player = {
	full_name: string;
	pls_min: number;
	imageUrl?: string | null;
	statistics: PlayerStatistics;
};

export type Team = {
	name: string;
	points: number;
	imageUrl?: string | null;
	starters?: Player[];
	bench?: Player[];
	score: {
		quarter1?: number;
		quarter2?: number;
		quarter3?: number;
		quarter4?: number;
		over_time?: number;
		total?: number;
	};
};

export type GameSummary = {
	id: string;
	status: string;
	date: string;
	clock: string;
	venue: string;
	tournament: {
		name: string;
		id: number;
		imageUrl?: string | null;
	};
	home: Team;
	away: Team;
};

export type StandingsData = {
	data: {
		id: string;
		name: string;
		imageUrl?: string | null;
		wins: number;
		losses: number;
		played: number;
		streak: number;
		gb: number;
		diff: number;
		win_pct: number;
	}[];
};

export type TeamStats = {
	name: string;
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
	starters: Player[];
	bench: Player[];
};

export type GameTeamStats = {
	home: TeamStats;
	away: TeamStats;
};

export type BasketballTournamentSchedule = {
	games: ScheduledGame[];
	total: number;
	competition: {
		name: string;
		id: number;
		imageUrl?: string | null;
		country?: {
			name: string;
			flag?: string | null;
		};
	};
};
