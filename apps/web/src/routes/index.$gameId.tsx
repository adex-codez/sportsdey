import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { FootballMatchInfo } from "@/components/football-match-info";
import { TopScorers } from "@/components/top-scorers";
import FootballStandingsTab from "@/components/football-section/FootballStandingsTab";
import FootballStatsTab from "@/components/football-section/FootballStatsTab";
import { useFootballMatchInfo } from "@/hooks/use-footmatch-info";
import DetailsImageCard from "@/shared/DetailsImageCard";
import { format } from "date-fns";
import { getTimeUntilStart, safeParseDate } from "@/utils/timeUtils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type {
	FootballStandingsResponse,
	FootballStatsResponse,
} from "@/types/football";
import { getTeamLogo } from "@/utils/getTeamLogo";
import { useFavorites } from "@/hooks/useFavorites";
import { VideosTab } from "@/components/basketball-section/VideosTab";
import ImportantUpdate from "@/shared/ImportantUpdate";

export const Route = createFileRoute("/index/$gameId")({
	component: RouteComponent,
});

function RouteComponent() {
	const [tab, setTab] = useState("info");
	const [countdown, setCountdown] = useState<string>("");
	const [standingsEnabled, setStandingsEnabled] = useState(false);
	const [statsEnabled, setStatsEnabled] = useState(false);
	const { gameId } = Route.useParams();
	const { data: gameInfo, isLoading } = useFootballMatchInfo(gameId, "en");
	const {
		isFavoriteTeam,
		toggleFavoriteTeam,
		isFavoriteLeague,
		toggleFavoriteLeague,
	} = useFavorites();

	const leagueId = gameInfo?.competition?.id;

	const { data: standingsData, isLoading: isStandingsLoading } = useQuery({
		queryKey: ["football", "standings", leagueId],
		queryFn: () =>
			apiRequest<FootballStandingsResponse>(`football/standings/${leagueId}`),
		enabled: !!leagueId && standingsEnabled,
		staleTime: 5 * 60 * 1000,
	});

	const { data: statsData, isLoading: isStatsLoading } = useQuery({
		queryKey: ["football", "stats", gameId],
		queryFn: () =>
			apiRequest<FootballStatsResponse>(`football/match/${gameId}/stats`),
		enabled: !!gameId && statsEnabled,
		staleTime: 5 * 60 * 1000,
	});

	const matchStatus =
		typeof gameInfo?.status === "string"
			? gameInfo?.status
			: gameInfo?.status?.shortname;
	useEffect(() => {
		console.log(statsData);
	}, [statsData]);

	useEffect(() => {
		if (tab === "table") {
			setStandingsEnabled(true);
		}
		if (tab === "stats") {
			setStatsEnabled(true);
		}
	}, [tab]);

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

	const homeTeamId = gameInfo?.competitors.home.name || "";
	const awayTeamId = gameInfo?.competitors.away.name || "";

	const isHomeFavorite = isFavoriteTeam(homeTeamId);
	const isAwayFavorite = isFavoriteTeam(awayTeamId);

	const handleToggleFavorite = (
		teamName: string,
		logo: string = "/Profile.png",
	) => {
		const tournamentName = gameInfo?.competition?.name || "";

		toggleFavoriteTeam({
			id: teamName,
			name: teamName,
			logo,
			sport: "football",
			tournament: tournamentName,
			tournamentId: gameInfo?.competition?.id?.toString(),
		});
	};

	const handleToggleFavoriteLeague = () => {
		if (!gameInfo?.competition) return;

		const tournamentName = gameInfo.competition.name || "";
		toggleFavoriteLeague({
			id: tournamentName,
			name: tournamentName,
			sport: "football",
			country: "",
		});
	};

	const renderTabContent = () => {
		switch (tab) {
			case "info":
				return <FootballMatchInfo setTab={setTab} info={gameInfo} />;
			case "top_scorers":
				return <TopScorers scorers={gameInfo.top_scorers} />;
			case "stats":
				return (
					<FootballStatsTab stats={statsData} isLoading={isStatsLoading} />
				);
			case "table":
				return (
					<FootballStandingsTab
						teams={standingsData?.standings || []}
						homeTeam={gameInfo.competitors.home.name}
						awayTeam={gameInfo.competitors.away.name}
						isLoading={isStandingsLoading}
					/>
				);
			case "videos":
				return (
					<VideosTab
						homeTeam={gameInfo.competitors.home.name}
						awayTeam={gameInfo.competitors.away.name}
					/>
				);
			default:
				return <FootballMatchInfo setTab={setTab} info={gameInfo} />;
		}
	};

	return (
		<div className="space-y-6">
			<DetailsImageCard
				competitionName={gameInfo.competition.name}
				hostTeamLogo={getTeamLogo(gameInfo.competitors.home.name)}
				guestTeamLogo={getTeamLogo(gameInfo.competitors.away.name)}
				hostTeamName={gameInfo.competitors.home.name}
				hostTeamScore={gameInfo.competitors.home.score}
				guestTeamName={gameInfo.competitors.away.name}
				guestTeamScore={gameInfo.competitors.away.score}
				competitionCountry=""
				matchStatus={
					matchStatus === "finished" ||
					matchStatus === "FPT" ||
					matchStatus === "FTO" ||
					matchStatus === "closed" ||
					matchStatus === "FT"
						? "FT"
						: matchStatus || ""
				}
				setActiveTab={setTab}
				activeTab={tab}
				isUpcoming={matchStatus === "SCH"}
				countdownText={countdown}
				scheduledDate={
					gameInfo.match_info.date_time
						? format(safeParseDate(gameInfo.match_info.date_time), "dd/MM/yyyy")
						: undefined
				}
				scheduledTime={
					gameInfo.match_info.date_time
						? format(safeParseDate(gameInfo.match_info.date_time), "HH:mm")
						: undefined
				}
				gameTabs={[
					{ id: "info", label: "Info" },
					{ id: "stats", label: "Stats" },
					{ id: "table", label: "Table" },
					{ id: "top_scorers", label: "Top Scorers" },
					{id: "videos", label: "Videos"}
				]}
				isHomeFavorite={isHomeFavorite}
				isAwayFavorite={isAwayFavorite}
				onToggleHomeFavorite={() =>
					gameInfo && handleToggleFavorite(gameInfo.competitors.home.name)
				}
				onToggleAwayFavorite={() =>
					gameInfo && handleToggleFavorite(gameInfo.competitors.away.name)
				}
				isFavorite={isFavoriteLeague(gameInfo.competition.name || "")}
				onFavoriteToggle={handleToggleFavoriteLeague}
			/>
			<div className="">{renderTabContent()}</div>
			<ImportantUpdate />
		</div>
	);
}
