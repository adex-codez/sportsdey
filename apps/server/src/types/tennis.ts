export type SportRadarTennisResponse = {
	generated_at: string;
	summaries: Array<{
		sport_event: {
			id: string;
			start_time: string;
			sport_event_context: {
				competition: {
					id: string;
					name: string;
					type?: string;
					gender?: string;
				};
			};
			competitors: Array<{
				id: string;
				name: string;
				qualifier: "home" | "away";
			}>;
		};
		sport_event_status: {
			status: string;
			home_score?: number;
			away_score?: number;
			period_scores?: Array<{
				home_score: number;
				away_score: number;
				type: string;
				number: number;
				home_tiebreak_score?: number;
				away_tiebreak_score?: number;
			}>;
			winner_id?: string;
		};
	}>;
};
