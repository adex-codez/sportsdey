export type ScheduleRes = {
	schedules: {
		sport_event: {
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
};
