import type { BasketballGameDetails } from "@/types/api";
import BasketBallScoreCard from "./BasketBallScoreCard";
import { TeamStats, type TeamStatsData } from "./TeamStats";
import VenueGuide from "./VenueGuide";

const InfoTab = ({
	gameDetails,
	teamStats,
}: {
	gameDetails?: BasketballGameDetails;
	teamStats?: TeamStatsData[];
}) => {
	if (!gameDetails) return null;

	return (
		<div className="w-full space-y-4">
			<div className="w-full">
				<BasketBallScoreCard
					team1={{
						name: gameDetails.home.name,
						quarterScores: gameDetails.home.score
							? [
									gameDetails.home.score["quarter1"] || 0,
									gameDetails.home.score["quarter2"] || 0,
									gameDetails.home.score["quarter3"] || 0,
									gameDetails.home.score["quarter4"] || 0,
								]
							: [0, 0, 0, 0],
						total: gameDetails.home.points ?? 0,
					}}
					team2={{
						name: gameDetails.away.name,
						quarterScores: gameDetails.away.score
							? [
									gameDetails.away.score["quarter1"] || 0,
									gameDetails.away.score["quarter2"] || 0,
									gameDetails.away.score["quarter3"] || 0,
									gameDetails.away.score["quarter4"] || 0,
								]
							: [0, 0, 0, 0],
						total: gameDetails.away.points ?? 0,
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
