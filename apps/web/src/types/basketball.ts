export type MatchStatus =
	| "FT"
	| "LIVE"
	| "Q1"
	| "Q2"
	| "Q3"
	| "Q4"
	| "HT"
	| "OT";
export interface SetScore {
	games: number;
	tiebreak?: number;
}
export interface Match {
	team1: string;
	team2: string;
	score1?: number;
	score2?: number;
	player1Sets?: SetScore[];
	player2Sets?: SetScore[];
	status?: MatchStatus | string;
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
	isFavorite?: boolean;
	onFavoriteToggle?: (e: React.MouseEvent) => void;
	sport?: string;
}

export interface MatchCardProps {
	team1: string;
	team2: string;
	player1Sets?: SetScore[];
	player2Sets?: SetScore[];
	score1?: number;
	score2?: number;
	status?: MatchStatus | string;
	time?: string;
	isFavorite?: boolean;
	onFavoriteToggle?: () => void;
	id?: string;
	country?: string;
	hideFinishedStatus?: boolean;
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
export interface DetailsImageProps {
	competitionName: string;
	competitionCountry: string;
	hostTeamName: string;
	guestTeamName: string;
	hostTeamLogo?: string;
	guestTeamLogo?: string;
	guestTeamScore: number;
	hostTeamScore: number;
	matchStatus: string;
}

export interface Quarter {
	id: string;
	label: string;
}

export interface TeamData {
	name: string;
	quarterScores: number[];
	total: number;
}

export interface QuarterScoreTableProps {
	team1: TeamData;
	team2: TeamData;
	quarters: Quarter[];
}

export type FilterType = "all" | "home" | "away" | "forms";

export type MatchResult = "W" | "L" | "D";

export interface TeamStanding {
	position: number;
	name: string;
	played: number;
	wins: number;
	losses: number;
	streak: number | string;
	gamesBehind: number | string;
	diff: string;
	pct: string;
	isHighlighted?: boolean;
	lastFiveResults?: MatchResult[];
}
