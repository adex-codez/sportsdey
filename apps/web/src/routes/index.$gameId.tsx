import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FootballMatchInfo } from "@/components/football-match-info";
import { useFootballMatchInfo } from "@/hooks/use-footmatch-info";
import { extractTeamInfo } from "@/lib/football";
import DetailsImageCard from "@/shared/DetailsImageCard";

export const Route = createFileRoute("/index/$gameId")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState("info");
	const { gameId } = Route.useParams();
	const { data: gameInfo, isLoading } = useFootballMatchInfo(gameId, "en");
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
					<FootballMatchInfo
						isLoading={isLoading}
						info={gameInfo}
						setTab={setTab}
					/>
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
				competitionName={gameInfo?.competition.name}
				hostTeamLogo=""
				guestTeamLogo=""
				hostTeamName={
					extractTeamInfo("home", "name", gameInfo.competitors) as string
				}
				hostTeamScore={
					extractTeamInfo("home", "score", gameInfo.competitors) as number
				}
				guestTeamName={
					extractTeamInfo("away", "name", gameInfo.competitors) as string
				}
				guestTeamScore={
					extractTeamInfo("away", "score", gameInfo.competitors) as number
				}
				competitionCountry=""
				matchStatus={gameInfo.status === "finished" ? gameInfo.status : ""}
				setActiveTab={setTab}
				activeTab={tab}
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
