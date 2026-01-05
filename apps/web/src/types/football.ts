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
			clock?: {
				played: string;
			};
		}[];
	}[];
};

export type FootballMatchInfoType = {
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
	standings?: {
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
	}[];
	top_scorers?: {
		id: string;
		name: string;
		team: {
			id: string;
			name: string;
			abbreviation: string;
		};
		gs: number;
		assists: number;
	}[];
	last5_home_results?: {
		match_id: string;
		date: string;
		opponent: string;
		result: "win" | "draw" | "loss";
		score: string;
	}[];
	last5_away_results?: {
		match_id: string;
		date: string;
		opponent: string;
		result: "win" | "draw" | "loss";
		score: string;
	}[];
};
