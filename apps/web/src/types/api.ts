import type { TeamStatsData } from "@/components/basketball-section/TeamStats";

export interface BasketballTeam {
	name: string;
	alias: string;
	points: number | null;
	imageUrl?: string;
}

export interface BasketballGame {
	id: string;
	status: string;
	time?: string;
	scheduledTime?: string;
	clock?: string;
	home: BasketballTeam;
	away: BasketballTeam;
}

// The user indicated the response is this object directly
export interface BasketballCompetition {
	id: string;
	name: string;
	imageUrl?: string;
	games: BasketballGame[];
}

export interface BasketballScheduleData {
	competitions: BasketballCompetition[];
}

export interface BasketballTournamentScheduleData {
	games: BasketballGame[];
	competition: {
		id: string;
		name: string;
	};
}

export interface BasketballScheduleResponse {
	success: boolean;
	data: BasketballScheduleData;
}

export interface BasketballStanding {
	id: string;
	name: string;
	imageUrl?: string;
	wins: number;
	losses: number;
	played: number;
	streak?: number | string;
	gb: number | string;
	diff: number | string;
	win_pct: number;
	points?: number; // Added from new API response
}

export interface BasketballStandingsResponse {
	success: boolean;
	data: {
		data: BasketballStanding[];
	};
}
export interface BasketballScore {
	quarter: number;
	points: number;
}

export interface BasketballPlayerStats {
	minutes?: string;
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
}

export interface BasketballPlayer {
	full_name: string;
	pls_min: number; // The new API returns this as a number (minutes)
	statistics: BasketballPlayerStats;
}

// Stats API Response Types
export interface BasketballTeamStatsResponse {
	success: boolean;
	data: {
		home: {
			name: string;
			starters: BasketballPlayer[];
			bench: BasketballPlayer[];
		};
		away: {
			name: string;
			starters: BasketballPlayer[];
			bench: BasketballPlayer[];
		};
	};
}

export interface BasketballTeamDetails {
	name: string;
	points: number;
	imageUrl?: string;
	score: {
		quarter1: number;
		quarter2: number;
		quarter3: number;
		quarter4: number;
		[key: string]: number; // Allow for OT etc
	};
	starters?: BasketballPlayer[]; // Made optional as it might not be in the basic game details
	bench?: BasketballPlayer[];
}

export interface BasketballGameDetails {
	id: string;
	status: string;
	tournament: {
		name: string;
		shortName: string;
		id: number;
	};
	date: string;
	venue: string;
	clock: string;
	home: BasketballTeamDetails;
	away: BasketballTeamDetails;
}

export interface BasketballGameDetailsResponse {
	success: boolean;
	data: BasketballGameDetails;
}

export interface BasketballGameStats {
	home: TeamStatsData;
	away: TeamStatsData;
}

// Tennis API Types
export interface TennisCompetitor {
	id: string;
	name: string;
	qualifier: "home" | "away";
}

export interface TennisSetScore {
	set_number: number;
	games_won: number;
	tiebreak_score?: number;
}

export interface TennisTeam {
	competitor: TennisCompetitor;
	set_scores: TennisSetScore[];
}

export interface TennisMatch {
	id: string;
	start_time: string;
	status: string;
	home_team: TennisTeam;
	away_team: TennisTeam;
	winner_id?: string;
}

export interface TennisCompetitionInfo {
	id: string;
	name: string;
	parent_id?: string;
	type: "singles" | "doubles" | "mixed";
	gender: "men" | "women";
	level?: string;
}

export interface TennisCompetition {
	competition: TennisCompetitionInfo;
	matches: TennisMatch[];
}

export interface TennisScheduleData {
	date: string;
	total_matches: number;
	competitions: TennisCompetition[];
}

export interface TennisMatchDetails {
	id: string;
	start_time: string;
	status: string;
	venue: {
		name: string;
		country?: string;
		country_code?: string;
		city?: string;
	};
	competition?: {
		id: string;
		name: string;
		type?: string;
		gender?: string;
	};
	home_team: TennisTeam;
	away_team: TennisTeam;
	winner_id?: string;
}

export interface TennisMatchDetailsData {
	match: TennisMatchDetails;
}

export interface BasketballVideo {
	videoId: string;
	publishedAt: string;
	title: string;
	description?: string; // Optional if future API adds it, but current response doesn't show it
}

export interface BasketballVideosData {
	nextPageToken?: string;
	prevPageToken?: string;
	videos: BasketballVideo[];
}

export interface BasketballVideosResponse {
	success: boolean;
	data: BasketballVideosData;
}
