import type { TeamStatsData } from "@/components/basketball-section/TeamStats";

export interface BasketballTeam {
  name: string;
  alias: string;
  points: number | null;
}

export interface BasketballGame {
  id: string;
  status: string;
  time?: string;
  scheduledTime?: string;
  home: BasketballTeam;
  away: BasketballTeam;
}

// The user indicated the response is this object directly
export interface BasketballScheduleData {
  league: string;
  games: BasketballGame[];
}

export interface BasketballScheduleResponse {
  success: boolean;
  data: BasketballScheduleData;
}

export interface BasketballStanding {
  id: string;
  name: string;
  wins: number;
  losses: number;
  played: number;
  streak: number | string;
  gb: number | string;
  diff: number | string;
  win_pct: number;
}

export interface BasketballStandingsResponse {
  success: boolean;
  data: BasketballStanding[];
}
export interface BasketballScore {
  quarter: number;
  points: number;
}

export interface BasketballPlayerStats {
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
  minutes_played?: string;
  pls_min?: number;
}

export interface BasketballPlayer {
  full_name: string;
  statistics: BasketballPlayerStats;
}

export interface BasketballTeamStatistics {
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
}

export interface BasketballTeamDetails {
  name: string;
  points: number;
  score?: BasketballScore[];
  statistics?: BasketballTeamStatistics;
  starters?: BasketballPlayer[];
  bench?: BasketballPlayer[];
}

export interface BasketballGameDetails {
  id: string;
  status: string;
  season: {
    id: string;
    year: number;
    type: string;
    name: string;
  };
  venue: {
    id: string;
    name: string;
  };
  clock?: string;
  quarter?: number;
  home: BasketballTeamDetails;
  away: BasketballTeamDetails;
  scheduledTime?: string;
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
	qualifier: 'home' | 'away';
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
	type: 'singles' | 'doubles' | 'mixed';
	gender: 'men' | 'women';
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
  venue: string;
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
