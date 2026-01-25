export type ScheduleRes = {
	schedules: {
		sport_event: {
			id: string;
			start_time: string;
			sport_event_context: {
				category: {
					id: string;
					name: string;
				};
				competition: {
					id: string;
					name: string;
					gender: string;
				};
			};
			competitors: {
				id: string;
				name: string;
				abbreviation: string;
				qualifier: string;
			}[];
		};
		sport_event_status: {
			match_status: string;
			home_score: number;
			away_score: number;
		};
		clock?: {
			played: string;
		};
	}[];
};

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
		};
		away: {
			id: string;
			name: string;
			score: number;
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
	team: {
		id: string;
		name: string;
		abbreviation: string;
	};
	gs: number; // goals scored
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
		// gender: string;
	};
	competitors: {
		home: {
			id: string;
			name: string;
			shortName: string;
			score?: number;
		};
		away: {
			id: string;
			name: string;
			shortName: string;
			score?: number;
		};
	};
	match_info: {
		date_time: string;
		stadium: string;
		// capacity: number;
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

export type ProxyMatchSummary = {
	homeTeam: {
		score?: {
			regular?: number;
			halfTime?: number;
			current?: number;
		};
		name: string;
		shortName: string;
		mediumName: string;
		id: number;
	};
	awayTeam: {
		score?: {
			regular?: number;
			halfTime?: number;
			current?: number;
		};
		name: string;
		shortName: string;
		mediumName: string;
		id: number;
	};
	status: {
		name: string;
		shortName: string;
		id: number;
	};
	info: {
		stadium?: {
			name: string;
			id: number;
		};
		weather?: {
			status: {
				name: string;
				id: number;
			};
			temperatureC: number;
			temperatureF: number;
		};
	};
	times?: {
		currentMinute: number;
	};
	date: string;
	id: number;
	tournament: {
		name: string;
		shortName: string;
		id: number;
	};
	stage?: {
		name: string;
		shortName: string;
		id: number;
	};
	round?: {
		name: string;
		shortName: string;
		id: number;
	};
};

export type ProxyStanding = {
	tournament: {
		name: string;
		shortName: string;
		id: number;
	};
	standings: {
		overall: {
			team: {
				name: string;
				shortName: string;
				mediumName: string;
				id: number;
			};
			positionStatus?: {
				name: string;
				id: number;
			};
			scored: number;
			against: number;
			average: number;
			position: number;
			delta: number;
			played: number;
			won: number;
			draw: number;
			lost: number;
			points: number;
		}[];
	};
};

export type ProxyGoalLeaderboard = {
	player: {
		country: {
			name: string;
			shortName: string;
			id: number;
		};
		position: {
			name: string;
			shortName: string;
			id: number;
		};
		knownName: string;
		knownNameMedium: string;
		knownNameShort: string;
		id: number;
	};
	team: {
		name: string;
		shortName: string;
		mediumName: string;
		id: number;
	};
	matchesStarted: number;
	minutesPlayed: number;
	position: number;
	matchesPlayed: number;
	totalGoals: number;
	goalsPerMatch: number;
	penaltyGoals: number;
	penaltyGoalsPerMatch: number;
};

// export type MatchSummaryRes = {
// 	sport_event: {
// 		sport_event_context: {
// 			season: { id: string };
// 		};
// 		competitors: { id: string }[];
// 	};
// };

export type ProxyMatchStats = {
	homeTeam: {
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
		shortName: string;
		mediumName: string;
		id: number;
	};
	awayTeam: {
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
		shortName: string;
		mediumName: string;
		id: number;
	};
	date: string;
	id: number;
};

export type TransformedMatchStats = {
	home: {
		statistics: ProxyMatchStats["homeTeam"]["statistics"];
		name: string;
		id: number;
	};
	away: {
		statistics: ProxyMatchStats["awayTeam"]["statistics"];
		name: string;
		id: number;
	};
	date: string;
	id: number;
};

export type StandingsRes = {
	standings: {
		type: string;
		groups: {
			id: string;
			standings: {
				competitor: { id: string; name: string };
				position: number;
				points: number;
				played: number;
				won: number;
				drawn: number;
				lost: number;
				goals_for: number;
				goals_against: number;
				goal_diff: number;
			}[];
		}[];
	}[];
};
