export type MatchStatus =
  | "FT"
  | "LIVE"
  | "Q1"
  | "Q2"
  | "Q3"
  | "Q4"
  | "HT"
  | "OT"
  | "UPCOMING";

export interface Match {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status?: MatchStatus;
  id?: string;
  date?: string;
  time?: string;
}

export interface BasketballComponentHeaderProps {
  flag?: string;
  country: string;
  league: string;
  matchCount?: number;
  isExpanded: boolean;
  onToggle: () => void;
  imageUrl?: string;
}

export interface MatchCardProps {
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status?: MatchStatus;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export interface BasketballAccordionComponentCardProps {
  country: string;
  league: string;
  flag?: string;
  matches: Match[];
  defaultExpanded?: boolean;
  imageUrl?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export interface FilterButtonProps {
  filter: FilterOption;
  isActive: boolean;
  onClick: () => void;
}

export interface League {
  id: string;
  country: string;
  leagueName: string;
  flag?: string;
  imageUrl?: string;
  matches: Match[];
}

export interface BasketballScoresPageProps {
  leagues?: League[];
  initialFilter?: string;
}

export interface FavoritesState {
  [key: string]: boolean;
}

export type BasketballFilterHeadersProps =
  | "all"
  | "live"
  | "finished"
  | "upcoming";
