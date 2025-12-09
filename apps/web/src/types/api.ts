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
  home: {
    name: string;
    points: number;
  };
  away: {
    name: string;
    points: number;
  };
  scheduledTime?: string;
  teams: TeamStatsData[] // Optional if sometimes present or if we need to extend
}

export interface BasketballGameDetailsResponse {
  success: boolean;
  data: BasketballGameDetails;
}

export interface BasketballGameStats {
  home: {
    name: string;
  };
  away: {
    name: string;
  };
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
