export type FootballSchedule = {
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
			match_status: string;
			clock?: {
				played: string;
			};
		}[];
	}[];
};
