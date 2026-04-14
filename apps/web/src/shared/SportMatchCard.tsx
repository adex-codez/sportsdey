import { Link } from "@tanstack/react-router";
import type React from "react";
import { formatClock } from "@/lib/utils";
import type { MatchCardProps, SetScore } from "@/types/sport";

const normalizeScore = (score: unknown): number | undefined => {
	if (typeof score === "number" && Number.isFinite(score)) return score;
	if (typeof score === "string") {
		const n = Number(score);
		return Number.isFinite(n) ? n : undefined;
	}
	if (!score || typeof score !== "object") return undefined;

	const record = score as Record<string, unknown>;
	const total = record.total ?? record.points;
	if (typeof total === "number" && Number.isFinite(total)) return total;

	const quarterKeys = [
		"quarter_1",
		"quarter_2",
		"quarter_3",
		"quarter_4",
		"quarter1",
		"quarter2",
		"quarter3",
		"quarter4",
		"over_time",
		"overtime",
		"ot",
	];

	let sum = 0;
	let found = false;
	for (const key of quarterKeys) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value)) {
			sum += value;
			found = true;
		}
	}
	return found ? sum : undefined;
};

const renderSetScore = (set: SetScore, isWinner: boolean) => {
	return (
		<span className={isWinner ? "font-semibold" : ""}>
			{set.games}
			{set.tiebreak !== undefined && (
				<sup className="ml-0.5 align-super font-medium text-[9px]">
					{set.tiebreak}
				</sup>
			)}
		</span>
	);
};

const calculateSetsWon = (playerSets: SetScore[], opponentSets: SetScore[]) => {
	let wins = 0;
	for (let i = 0; i < playerSets.length; i++) {
		if (playerSets[i].games > opponentSets[i]?.games) wins++;
	}
	return wins;
};

const SportMatchCard: React.FC<MatchCardProps> = ({
	sport,
	id,
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
	country,
	detailRoute,
	hideFinishedStatus = false,
}) => {
	const normalizedScore1 = normalizeScore(score1);
	const normalizedScore2 = normalizeScore(score2);

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
		sport === "tennis"
			? s === "inprogress"
			: s === "live" ||
				s === "q1" ||
				s === "q2" ||
				s === "q3" ||
				s === "q4" ||
				s === "ht" ||
				s === "ot" ||
				s === "1h" ||
				s === "2h" ||
				s === "break" ||
				s === "half time" ||
				(s !== "sch" && s !== "scheduled" && !isFinished);

	const shouldShowScores = isLive || isFinished;
	const isTennis = sport === "tennis";

	const cardContent = (
		<div
			className={`grid cursor-pointer dark:text-white ${hideFinishedStatus ? "grid-cols-[40px_1fr_40px]" : "grid-cols-[50px_1fr_40px]"} items-center gap-x-4 border-border border-b px-5 py-3.5 transition-colors last:border-b-0 hover:bg-muted/30`}
		>
			<div
				className={`flex h-8.75 w-8.75 items-center justify-center rounded-[10px] capitalize ${
					s !== "sch" && s !== "scheduled" && !isFinished && isLive
						? "animate-pulse bg-[#0E8F1A] font-medium text-[9px] text-white"
						: "font-medium text-muted-foreground text-xs"
				}`}
			>
				{(() => {
					if (hideFinishedStatus && isFinished) return null;
					if (isFinished) return "FT";

					if (isTennis) {
						if (s === "scheduled" || s === "ns") return time;
						if (s === "inprogress") return "Live";
						return status;
					}

					return clock && clock !== ""
						? formatClock(clock)
						: s === "sch" || s === "scheduled"
							? time
							: status;
				})()}
			</div>

			{isTennis && player1Sets && player2Sets ? (
				<div className="flex flex-col gap-1.5 text-sm">
					<div className="flex items-center justify-between">
						<span
							className={`text-foreground transition-all duration-300 ${shouldShowScores && calculateSetsWon(player1Sets, player2Sets) > calculateSetsWon(player2Sets, player1Sets) ? "font-semibold" : ""}`}
						>
							{team1}
						</span>
						<div className="flex min-w-20 justify-end gap-3 font-mono text-foreground">
							{player1Sets.map((set, idx) => (
								<span
									key={idx}
									className={`w-4 text-center transition-all duration-300 ${isLive ? "animate-[fadeIn_0.5s_ease-in-out]" : ""}`}
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
					<div className="flex items-center justify-between">
						<span
							className={`text-foreground transition-all duration-300 ${shouldShowScores && calculateSetsWon(player2Sets, player1Sets) > calculateSetsWon(player1Sets, player2Sets) ? "font-semibold" : ""}`}
						>
							{team2}
						</span>
						<div className="flex min-w-20 justify-end gap-3 font-mono text-foreground">
							{player2Sets.map((set, idx) => (
								<span
									key={idx}
									className={`w-4 text-center transition-all duration-300 ${isLive ? "animate-[fadeIn_0.5s_ease-in-out]" : ""}`}
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
					<div className="flex items-center justify-between">
						<span
							className={`text-primary dark:text-white ${shouldShowScores && (normalizedScore1 != null && normalizedScore2 != null && normalizedScore1 > normalizedScore2) ? "font-semibold" : ""}`}
						>
							{team1}
						</span>
						<span
							className={`min-w-10 text-right text-primary dark:text-white ${shouldShowScores && (normalizedScore1 != null && normalizedScore2 != null && normalizedScore1 > normalizedScore2) ? "font-semibold" : ""}`}
						>
							{shouldShowScores && normalizedScore1 != null
								? normalizedScore1
								: ""}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span
							className={`text-primary dark:text-white ${shouldShowScores && (normalizedScore1 != null && normalizedScore2 != null && normalizedScore2 > normalizedScore1) ? "font-semibold" : ""}`}
						>
							{team2}
						</span>
						<span
							className={`min-w-10 text-right text-primary dark:text-white ${shouldShowScores && (normalizedScore1 != null && normalizedScore2 != null && normalizedScore2 > normalizedScore1) ? "font-semibold" : ""}`}
						>
							{shouldShowScores && normalizedScore2 != null
								? normalizedScore2
								: ""}
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
				className={`cursor-pointer border-none bg-transparent text-xl transition-colors ${
					isFavorite
						? "text-yellow-400"
						: "text-[#C8C8C8] hover:text-yellow-400"
				}`}
			>
				★
			</button>
		</div>
	);

	if (id && detailRoute) {
		const routeParts = detailRoute.split("$");
		const paramName = routeParts[1] || "id";

		return (
			<Link
				to={detailRoute}
				params={{ [paramName]: id }}
				search={{ country }}
				className="block"
			>
				{cardContent}
			</Link>
		);
	}

	return cardContent;
};

export default SportMatchCard;
