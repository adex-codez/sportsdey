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
	sport_event_id: string;
	competitors: TransformedCompetitor[];
	start_time: string;
	match_status: string;
	clock?: {
		played: string;
	};
};

export type CompetitionGroup = {
	competition: {
		id: string;
		name: string;
		gender: string;
	};
	category: {
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
	assists: number;
};

export type TransformedMatchInfo = {
	competition: {
		id: string;
		name: string;
		gender: string;
	};
	season: {
		id: string;
	};
	competitors: {
		id: string;
		name: string;
		qualifier: string;
		score: number;
	}[];
	match_info: {
		date_time: string;
		stadium: string;
		capacity: number;
	};
	clock?: {
		played: string;
		stoppage_time_played?: string;
	};
	status: string;
	standings?: TeamStanding[];
	top_scorers?: TopScorer[];
};

// export type MatchSummaryRes = {
// 	sport_event: {
// 		sport_event_context: {
// 			season: { id: string };
// 		};
// 		competitors: { id: string }[];
// 	};
// };

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
