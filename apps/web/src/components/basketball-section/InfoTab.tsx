import type { BasketballGameDetails } from "@/types/api";
import BasketBallScoreCard from "./BasketBallScoreCard";
import { TeamStats, type TeamStatsData } from "./TeamStats";
import VenueGuide from "./VenueGuide";

const getQuarterScore = (
	score: Record<string, unknown> | undefined,
	key: string,
): number => {
	if (!score) return 0;
	const value = score[key] ?? score[`quarter_${key.replace("quarter", "")}`];
	return typeof value === "number" ? value : 0;
};

const getScoreTotal = (
	score: Record<string, unknown> | undefined,
	points: number | undefined,
): number => {
	if (points !== undefined) return points;
	if (!score) return 0;
	const total = score.total;
	return typeof total === "number" ? total : 0;
};

const InfoTab = ({
	gameDetails,
	teamStats,
}: {
	gameDetails?: BasketballGameDetails;
	teamStats?: TeamStatsData[];
}) => {
	if (!gameDetails) return null;

	const homeScore = gameDetails.home.score as
		| Record<string, unknown>
		| undefined;
	const awayScore = gameDetails.away.score as
		| Record<string, unknown>
		| undefined;

	return (
		<div className="w-full space-y-4">
			<div className="w-full">
				<BasketBallScoreCard
					team1={{
						name: gameDetails.home.name,
						quarterScores: homeScore
							? [
									getQuarterScore(homeScore, "quarter1"),
									getQuarterScore(homeScore, "quarter2"),
									getQuarterScore(homeScore, "quarter3"),
									getQuarterScore(homeScore, "quarter4"),
								]
							: [0, 0, 0, 0],
						total: getScoreTotal(homeScore, gameDetails.home.points),
					}}
					team2={{
						name: gameDetails.away.name,
						quarterScores: awayScore
							? [
									getQuarterScore(awayScore, "quarter1"),
									getQuarterScore(awayScore, "quarter2"),
									getQuarterScore(awayScore, "quarter3"),
									getQuarterScore(awayScore, "quarter4"),
								]
							: [0, 0, 0, 0],
						total: getScoreTotal(awayScore, gameDetails.away.points),
					}}
					quarters={[
						{ id: "q1", label: "Q1" },
						{ id: "q2", label: "Q2" },
						{ id: "q3", label: "Q3" },
						{ id: "q4", label: "Q4" },
					]}
				/>
			</div>
			<div className="w-full">
				<VenueGuide venueName={gameDetails.venue || "n/a"} />
			</div>
			<div className="mx-auto w-full">
				<TeamStats teams={teamStats || []} />
			</div>
		</div>
	);
};

export default InfoTab;
