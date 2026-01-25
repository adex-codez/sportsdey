import type { TennisMatchDetails } from "@/types/api";
import VenueGuide from "../basketball-section/VenueGuide";
import TennisScoreTable from "./TennisScoreTable";

interface TennisInfoProps {
	matchData?: TennisMatchDetails;
}

const TennisInfo = ({ matchData }: TennisInfoProps) => {
	if (!matchData) {
		return (
			<div className="w-full space-y-4">
				<p className="text-gray-500 text-sm">Loading match information...</p>
			</div>
		);
	}

	const players = [
		{
			name: matchData.home_team.competitor.name,
			periodScores: matchData.home_team.set_scores.map((s) => s.games_won),
			pts: "",
			s: "",
		},
		{
			name: matchData.away_team.competitor.name,
			periodScores: matchData.away_team.set_scores.map((s) => s.games_won),
			pts: "",
			s: "",
		},
	];

	return (
		<div className="w-full space-y-4">
			<div className="w-full">
				<TennisScoreTable players={players} />
			</div>
			<div className="w-full">
				<VenueGuide venueName={matchData.venue?.name || "Tennis Court"} />
			</div>
		</div>
	);
};

export default TennisInfo;
