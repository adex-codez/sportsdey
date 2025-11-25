export type FootballSchedule = {
	total_matches: number;
	competitions: {
		competition: {
			id: string;
			name: string;
			gender: string;
		};
		category: {
			id: string;
			name: string;
		};
		matches: {
			competitors: {
				id: string;
				name: string;
				abbreviation: string;
				qualifier: string;
				score: number;
			}[];
			start_time: string;
			match_status: string;
			clock?: {
				played: string;
			};
		}[];
	}[];
};
