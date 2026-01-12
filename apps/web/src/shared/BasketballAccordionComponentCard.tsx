import type {
	BasketballAccordionComponentCardProps,
	BasketballComponentHeaderProps,
	MatchCardProps,
	SetScore,
} from "@/types/basketball";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { formatClock } from "@/lib/utils";

const BasketballComponentHeader: React.FC<BasketballComponentHeaderProps> = ({
	flag,
	country,
	league,
	isExpanded,
	onToggle,
	imageUrl,
	isFavorite,
	onFavoriteToggle,
}) => {
	return (
		<div
			className="w-full flex justify-between items-center border-b px-5 py-4 cursor-pointer transition-colors"
			onClick={onToggle}
		>
			<div className="flex gap-x-3 items-center">
				{flag ? (
					<img
						src={flag}
						alt={`${country} flag`}
						className="w-6 h-6 rounded-full"
					/>
				) : imageUrl ? (
					<img
						src={imageUrl}
						alt={`${country} flag`}
						className="w-6 h-6 rounded-full"
					/>
				) : (
					<img
						src={`/${country}.png`}
						alt={`${country} flag`}
						className="w-6 h-6 rounded-full"
					/>
				)}
				<div className="inline-flex items-center gap-x-1 text-sm">
					<p className="font-bold text-primary">
						{country === "South Korea" ? "S/Korea" : country}
					</p>
					-<p className="text-primary font-bold text-xs">{league}</p>
					<button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							onFavoriteToggle?.(e);
						}}
						className={`text-sm border-none bg-transparent cursor-pointer transition-colors ml-1 ${
							isFavorite
								? "text-yellow-400"
								: "text-[#C8C8C8] hover:text-yellow-400"
						}`}
					>
						★
					</button>
				</div>
			</div>
			<span className={`text-xs text-primary`}>
				{isExpanded ? <ChevronRight /> : <ChevronDown />}
			</span>
		</div>
	);
};

const MatchCard: React.FC<MatchCardProps> = ({
	team1,
	team2,
	score1,
	score2,
	player1Sets,
	player2Sets,
	status = "FT",
	isFavorite = false,
	clock,
	time,
	onFavoriteToggle,
	id,
	country,
	hideFinishedStatus = false,
}) => {
	const { state } = useRouter();
	const pathname = state.location.pathname;
	const isTennisRoute =
		pathname.includes("/tennis") || pathname.includes("tennis");

	const renderSetScore = (set: SetScore, isWinner: boolean) => {
		return (
			<span className={isWinner ? "font-semibold" : ""}>
				{set.games}
				{set.tiebreak !== undefined && (
					<sup className="text-[9px] align-super ml-0.5 font-medium">
						{set.tiebreak}
					</sup>
				)}
			</span>
		);
	};

	const calculateSetsWon = (
		playerSets: SetScore[],
		opponentSets: SetScore[],
	) => {
		let wins = 0;
		for (let i = 0; i < playerSets.length; i++) {
			if (playerSets[i].games > opponentSets[i]?.games) wins++;
		}
		return wins;
	};

	const s = status?.toLowerCase() || "";
	const isFinished =
		s.includes("full time") ||
		s.includes("finished") ||
		s === "closed" ||
		s === "ended" ||
    s === "fto" ||
    s === "fpt" ||
    s === "fpo" ||
		s === "ft";
	const isLive =
		s === "live" ||
		s === "q1" ||
		s === "q2" ||
		s === "q3" ||
		s === "q4" ||
		s === "ht" ||
		s === "ot";
	const shouldShowScores = isLive || isFinished;

	const cardContent = (
		<div
			className={`grid cursor-pointer ${hideFinishedStatus ? "grid-cols-[40px_1fr_40px]" : "grid-cols-[50px_1fr_40px]"} items-center gap-x-4 px-5 py-3.5 border-b border-border hover:bg-muted/30 transition-colors last:border-b-0`}
		>
			<div
				className={`flex items-center justify-center capitalize w-8.75 h-8.75 rounded-[10px] ${
					s !== "sch" && s !== "scheduled" && !isFinished
						? "bg-[#0E8F1A] text-white text-[9px] font-medium animate-pulse"
						: "text-muted-foreground text-xs font-medium"
				}`}
			>
				{(() => {
					if (hideFinishedStatus && isFinished) return null;
					if (isFinished) return "FT";

					return clock && clock !== "" ? formatClock(clock) : s === "sch" || s === "scheduled" ? time : status;
				})()}
			</div>

			{isTennisRoute && player1Sets && player2Sets ? (
				<div className="flex flex-col gap-1.5 text-sm">
					<div className="flex justify-between items-center">
						<span
							className={`text-foreground transition-all duration-300 ${shouldShowScores && calculateSetsWon(player1Sets, player2Sets) > calculateSetsWon(player2Sets, player1Sets) ? "font-semibold" : ""}`}
						>
							{team1}
						</span>
						<div className="flex gap-3 min-w-20 justify-end font-mono text-foreground">
							{player1Sets.map((set, idx) => (
								<span
									key={idx}
									className={`w-4 text-center transition-all duration-300 ${
										s === "live" ? "animate-[fadeIn_0.5s_ease-in-out]" : ""
									}`}
								>
									{shouldShowScores
										? renderSetScore(
												set,
												set.games > (player2Sets[idx]?.games ?? 0),
											)
										: ""}
								</span>
							))}
						</div>
					</div>
					<div className="flex justify-between items-center">
						<span
							className={`text-foreground transition-all duration-300 ${shouldShowScores && calculateSetsWon(player2Sets, player1Sets) > calculateSetsWon(player1Sets, player2Sets) ? "font-semibold" : ""}`}
						>
							{team2}
						</span>
						<div className="flex gap-3 min-w-20 justify-end font-mono text-foreground">
							{player2Sets.map((set, idx) => (
								<span
									key={idx}
									className={`w-4 text-center transition-all duration-300 ${
										s === "live" ? "animate-[fadeIn_0.5s_ease-in-out]" : ""
									}`}
								>
									{shouldShowScores
										? renderSetScore(
												set,
												set.games > (player1Sets[idx]?.games ?? 0),
											)
										: ""}
								</span>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-1.5 text-sm">
					<div className="flex justify-between items-center">
						<span
							className={`text-primary ${shouldShowScores && (score1 != null && score2 != null && score1 > score2) ? "font-semibold" : ""}`}
						>
							{team1}
						</span>
						<span
							className={`text-primary min-w-10 text-right ${shouldShowScores && (score1 != null && score2 != null && score1 > score2) ? "font-semibold" : ""}`}
						>
							{shouldShowScores && score1 != null ? score1 : ""}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span
							className={`text-primary ${shouldShowScores && (score1 != null && score2 != null && score2 > score1) ? "font-semibold" : ""}`}
						>
							{team2}
						</span>
						<span
							className={`text-primary min-w-10 text-right ${shouldShowScores && (score1 != null && score2 != null && score2 > score1) ? "font-semibold" : ""}`}
						>
							{shouldShowScores && score2 != null ? score2 : ""}
						</span>
					</div>
				</div>
			)}

			<button
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onFavoriteToggle?.();
				}}
				className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${
					isFavorite
						? "text-yellow-400"
						: "text-[#C8C8C8] hover:text-yellow-400"
				}`}
			>
				★
			</button>
		</div>
	);

	if (isTennisRoute && id) {
		return (
			<Link
				to="/tennis/$Id"
				params={{ Id: id }}
				search={{ country }}
				className="block"
			>
				{cardContent}
			</Link>
		);
	}

	return cardContent;
};

const SportAccordionCard: React.FC<BasketballAccordionComponentCardProps> = ({
	country,
	league,
	tournamentId,
	flag,
	matches,
	defaultExpanded = true,
	imageUrl,
}) => {
	const {
		isFavoriteLeague,
		toggleFavoriteLeague,
		isFavoriteMatch,
		toggleFavoriteMatch,
	} = useFavorites();
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const router = useRouter();
	const pathname = router.state.location.pathname;
	const isTennisRoute = pathname.includes("tennis");
	const sport = isTennisRoute ? "tennis" : "basketball";

	const handleLeagueFavoriteToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		toggleFavoriteLeague({
			id: league, // Using league name as ID for now as per common pattern in this app
			name: league,
			country,
			flag,
			sport,
		});
	};

	const getCountryCode = (name: string): string => {
		const lowerName = name.toLowerCase();
		const mapping: Record<string, string> = {
			usa: "us",
			nba: "us",
			ncaa: "us",
			america: "us",
			turkey: "tr",
			turkish: "tr",
			tbsl: "tr",
			bsl: "tr",
			efes: "tr",
			spain: "es",
			spanish: "es",
			acb: "es",
			germany: "de",
			german: "de",
			bbl: "de",
			france: "fr",
			french: "fr",
			lnb: "fr",
			italy: "it",
			italian: "it",
			lba: "it",
			greece: "gr",
			greek: "gr",
			australia: "au",
			australian: "au",
			china: "cn",
			chinese: "cn",
			cba: "cn",
			philippines: "ph",
			philippine: "ph",
			pba: "ph",
			japan: "jp",
			japanese: "jp",
			"b.league": "jp",
		};
		for (const key in mapping) {
			if (lowerName.includes(key)) return mapping[key];
		}
		return "";
	};

	const getCountryName = (name: string): string => {
		const code = getCountryCode(name);
		if (code === "tr") return "Turkey";
		if (code === "us") return "USA";
		if (code === "de") return "Germany";
		if (code === "es") return "Spain";
		if (code === "fr") return "France";
		if (code === "it") return "Italy";
		if (code === "gr") return "Greece";
		return name || "International";
	};

	const handleToggleFavorite = (match: any) => {
		if (!match.id) return;
		toggleFavoriteMatch({
			id: match.id,
			team1: match.team1 || "",
			team2: match.team2 || "",
			time: match.time,
			sport: sport,
			tournament: league,
			country: getCountryName(country || league || ""),
			flag:
				flag ||
				(getCountryCode(country || league || "")
					? `https://flagcdn.com/w40/${getCountryCode(country || league || "")}.png`
					: undefined),
		});
	};

	const getRoutePath = () => {
		let routePath = "";
		if (pathname.includes("/basketball") || pathname.includes("basketball")) {
			routePath = `/basketball/$Id`;
		}
		if (pathname.includes("/tennis") || pathname.includes("tennis")) {
			routePath = `/tennis/$Id`;
		}
		return routePath;
	};

	const isTournamentPage = pathname.includes("/basketball/tournament/");

	return (
		<div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
			{!isTournamentPage && tournamentId ? (
				<Link
					to="/basketball/tournament/$tournamentId"
						params={{ tournamentId: String(tournamentId) }} search={{ league } as any}>
					<BasketballComponentHeader
						flag={flag}
						country={country}
						league={league}
						isExpanded={isExpanded}
						// onToggle={() => setIsExpanded(!isExpanded)}
						imageUrl={imageUrl}
						isFavorite={isFavoriteLeague(league)}
						onFavoriteToggle={handleLeagueFavoriteToggle}
					/>
				</Link>
			) : (
				<BasketballComponentHeader
					flag={flag}
					country={country}
					league={league}
					isExpanded={isExpanded}
					// onToggle={() => setIsExpanded(!isExpanded)}
					imageUrl={imageUrl}
					isFavorite={isFavoriteLeague(league)}
					onFavoriteToggle={handleLeagueFavoriteToggle}
				/>
			)}
			

			{isExpanded && matches && (
				<div className="flex flex-col">
					{matches.map((match, index) => (
						<Link
							key={match.id || index}
							to={`${getRoutePath()}`}
							params={{ Id: match.id! }}
							search={{ country }}
						>
							<MatchCard
								team1={match.team1}
								team2={match.team2}
								time={match.time}
								clock={match.clock}
								player1Sets={match.player1Sets}
								player2Sets={match.player2Sets}
								score1={match.score1}
								score2={match.score2}
								status={match.status ? match.status : match.time}
								isFavorite={match.id ? isFavoriteMatch(match.id) : false}
								onFavoriteToggle={() => handleToggleFavorite(match)}
								country={country}
								id={match.id}
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default SportAccordionCard;
export { BasketballComponentHeader, MatchCard };
