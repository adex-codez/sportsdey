export type TransformedCompetitor = {
	id: string;
	name: string;
	abbreviation: string;
	qualifier: string;
	score: number;
};

export type TransformedMatch = {
	id: string;
	competitors: {
		home: {
			id: string;
			name: string;
			score: number;
			imageUrl?: string | null;
		};
		away: {
			id: string;
			name: string;
			score: number;
			imageUrl?: string | null;
		};
	};
	start_time: string;
	match_status: string;
	clock?: number;
};

export type CompetitionGroup = {
	competition: {
		id: string;
		name: string;
		imageUrl?: string | null;
		country?: {
			name: string;
			flag?: string | null;
		};
	};
	matches: TransformedMatch[];
};

export type TransformedResponse = {
	competitions: CompetitionGroup[];
	total_matches: number;
};

export type TeamStanding = {
	id: string;
	name: string;
	position: number;
	points: number;
	imageUrl?: string | null;
	played: number;
	won: number;
	drawn: number;
	lost: number;
	goals_for: number;
	goals_against: number;
	goal_diff: number;
};

export type TopScorer = {
	id: string;
	name: string;
	imageUrl?: string | null;
	team: {
		id: string;
		name: string;
		abbreviation: string;
		imageUrl?: string | null;
	};
	gs: number;
};

export type MatchResultSummary = {
	match_id: string;
	date: string;
	opponent: string;
	result: "win" | "draw" | "loss";
	score: string;
};

export type H2HMatch = {
	id: string;
	date: string;
	result: "W" | "D" | "L";
};

export type TransformedMatchInfo = {
	competition: {
		id: string;
		name: string;
		imageUrl?: string | null;
		country?: {
			name: string;
			flag?: string | null;
		};
	};
	competitors: {
		home: {
			id: string;
			name: string;
			shortName: string;
			score?: number;
			imageUrl?: string | null;
		};
		away: {
			id: string;
			name: string;
			shortName: string;
			score?: number;
			imageUrl?: string | null;
		};
	};
	match_info: {
		date_time: string;
		stadium: string;
	};
	clock?: number;
	status: {
		name: string;
		shortname: string;
	};
	standings?: TeamStanding[];
	top_scorers?: TopScorer[];
	homeH2H?: H2HMatch[];
	awayH2H?: H2HMatch[];
};

export type FullTeamStanding = {
	name: string;
	imageUrl?: string | null;
	position: number;
	statistics: {
		P: number;
		W: number;
		D: number;
		L: number;
		GD: number;
		PTS: number;
	};
};

export type FullStandingsResponse = {
	tournament: {
		id: number;
		name: string;
	};
	standings: FullTeamStanding[];
};

export type TransformedMatchStats = {
	home: {
		statistics: {
			ballPossession: number;
			shotsOnTarget: number;
			shotsOffTarget: number;
			fouls: number;
			corners: number;
			offsides: number;
			saves: number;
			yellowCards: number;
			secondYellowCards: number;
			redCards: number;
		};
		name: string;
		id: number;
		imageUrl?: string | null;
	};
	away: {
		statistics: {
			ballPossession: number;
			shotsOnTarget: number;
			shotsOffTarget: number;
			fouls: number;
			corners: number;
			offsides: number;
			saves: number;
			yellowCards: number;
			secondYellowCards: number;
			redCards: number;
		};
		name: string;
		id: number;
		imageUrl?: string | null;
	};
	date: string;
	id: number;
};
