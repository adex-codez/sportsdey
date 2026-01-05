import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { FootballMatchInfo } from "@/components/football-match-info";
import { useFootballMatchInfo } from "@/hooks/use-footmatch-info";
import DetailsImageCard from "@/shared/DetailsImageCard";
import { format } from "date-fns";
import { getTimeUntilStart, safeParseDate } from "@/utils/timeUtils";

export const Route = createFileRoute("/index/$gameId")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState("info");
	const [countdown, setCountdown] = useState<string>("");
	const { gameId } = Route.useParams();
	const { data: gameInfo, isLoading } = useFootballMatchInfo(gameId, "en");

	const matchStatus = typeof gameInfo?.status === 'string'
		? gameInfo?.status
		: gameInfo?.status?.shortname;

	useEffect(() => {
		if (matchStatus === "SCH" && gameInfo?.match_info.date_time) {
			const updateCountdown = () => {
				setCountdown(getTimeUntilStart(gameInfo.match_info.date_time));
			};
			updateCountdown();
			const interval = setInterval(updateCountdown, 1000);
			return () => clearInterval(interval);
		}
	}, [gameInfo, matchStatus]);
	if (isLoading) {
		return (
			<div className="flex h-[40%] flex-col items-center justify-center space-y-2">
				<Loader2 className="animate-spin" width={48} height={48} />
				<p className="text-gray-500 text-sm">Loading matches info...</p>
			</div>
		);
	}
	if (!gameInfo) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<p className="text-gray-500 text-sm">Match info unavailable...</p>
			</div>
		);
	}

	const renderTabContent = () => {
		switch (tab) {
			case "info":
				return (
					<FootballMatchInfo info={gameInfo} setTab={setTab} />
				);
			// case "info":
			// 	return <div>Info</div>;
			// case "info":
			// 	return <div>Info</div>;
		}
	};

	return (
		<div>
			<DetailsImageCard
				competitionName={gameInfo.competition.name}
				hostTeamLogo="/Profile.png"
				guestTeamLogo="/Profile.png"
				hostTeamName={
					gameInfo.competitors.home.name
				}
				hostTeamScore={
					gameInfo.competitors.home.score
				}
				guestTeamName={
					gameInfo.competitors.away.name
				}
				guestTeamScore={
					gameInfo.competitors.away.score
				}
				competitionCountry=""
				matchStatus={matchStatus === "finished" || matchStatus === "closed" || matchStatus === "FT" ? "FT" : matchStatus || ""}
				setActiveTab={setTab}
				activeTab={tab}
				isUpcoming={matchStatus === "SCH"}
				countdownText={countdown}
				scheduledDate={gameInfo.match_info.date_time ? format(safeParseDate(gameInfo.match_info.date_time), "dd/MM/yyyy") : undefined}
				scheduledTime={gameInfo.match_info.date_time ? format(safeParseDate(gameInfo.match_info.date_time), "HH:mm") : undefined}
				gameTabs={[
					{ id: "info", label: "Info" },
					{ id: "stats", label: "Stats" },
					{ id: "table", label: "Table" },
					{ id: "top_scorers", label: "Top Scorers" },
				]}
			/>
			<div className="mt-6">{renderTabContent()}</div>
		</div>
	);
}
