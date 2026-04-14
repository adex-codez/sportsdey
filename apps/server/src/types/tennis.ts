export type ApiTennisFixturesResponse = {
	success: number;
	result: Array<{
		event_key: string;
		event_date: string;
		event_time: string;
		event_first_player: string;
		first_player_key: string;
		event_second_player: string;
		second_player_key: string;
		event_final_result: string;
		event_game_result: string;
		event_serve: string | null;
		event_winner: string | null;
		event_status: string;
		event_type_type: string;
		tournament_name: string;
		tournament_key: string;
		tournament_round: string;
		tournament_season: string;
		event_live: string;
		event_qualification: string;
		event_first_player_logo: string | null;
		event_second_player_logo: string | null;
		pointbypoint: Array<any>;
		scores: Array<{
			score_first: string;
			score_second: string;
			score_set: string;
		}>;
	}>;
};
