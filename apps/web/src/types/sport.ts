export type SportType = "basketball" | "tennis" | "football";

export interface SetScore {
	games: number;
	tiebreak?: number;
}

export interface MatchCardProps {
	sport: SportType;
	id?: string;
	team1: string;
	team2: string;
	score1?: number;
	score2?: number;
	player1Sets?: SetScore[];
	player2Sets?: SetScore[];
	status?: string;
	time?: string;
	clock?: string;
	country?: string;
	isFavorite?: boolean;
	onFavoriteToggle?: () => void;
	detailRoute?: string;
	hideFinishedStatus?: boolean;
}

export interface SportAccordionProps {
	sport: SportType;
	country: string;
	league: string;
	tournamentId?: string;
	flag?: string;
	matches: any[];
	defaultExpanded?: boolean;
	imageUrl?: string;
	detailRoute?: string;
	tournamentRoute?: string;
	showTournamentLink?: boolean;
}
