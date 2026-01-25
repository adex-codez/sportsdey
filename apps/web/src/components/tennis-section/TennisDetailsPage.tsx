import { useQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { useApiError } from "@/hooks/useApiError";
import { apiRequest } from "@/lib/api";
import DetailsImageCard from "@/shared/DetailsImageCard";
import type { TennisMatchDetailsData } from "@/types/api";
import { getTimeUntilStart, safeParseDate } from "@/utils/timeUtils";
import TennisInfo from "./TennisInfo";

const TennisDetailsPage = () => {
	const { Id } = useParams({ from: "/tennis/$Id" });
	const search = useSearch({ from: "/tennis/$Id" });
	const [activeTab, setActiveTab] = useState("info");
	const [countdown, setCountdown] = useState<string>("");

	const { data, isLoading, error, isError, refetch } = useQuery({
		queryKey: ["tennis", "match", Id],
		queryFn: () =>
			apiRequest<TennisMatchDetailsData>(`tennis/game/${Id}?language=en`),
	});

	const { isNetworkError } = useApiError({ error, isError, refetch });

	useEffect(() => {
		if (data?.match.status === "not_started" && data.match.start_time) {
			const updateCountdown = () => {
				setCountdown(getTimeUntilStart(data.match.start_time));
			};

			updateCountdown();
			const interval = setInterval(updateCountdown, 1000);

			return () => clearInterval(interval);
		}
	}, [data]);

	const gameTabs = [
		{ id: "info", label: "Info" },
		{ id: "videos", label: "Videos" },
		{ id: "news", label: "News" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "info":
				return <TennisInfo matchData={data?.match} />;

			case "videos":
				return (
					<div className="space-y-4">
						<h3 className="font-bold text-primary text-xl">Game Highlights</h3>
						<div className="grid grid-cols-2 gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="cursor-pointer overflow-hidden rounded-lg bg-gray-800 ring-blue-500 transition hover:ring-2"
								>
									<div className="flex h-32 items-center justify-center bg-linear-to-br from-blue-900 to-gray-900">
										<svg
											className="h-12 w-12 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
										</svg>
									</div>
									<div className="p-3">
										<p className="font-medium text-primary text-sm">
											Highlight {i}
										</p>
										<p className="text-gray-400 text-xs">2:15</p>
									</div>
								</div>
							))}
						</div>
					</div>
				);

			case "news":
				return (
					<div className="space-y-4">
						<h3 className="font-bold text-primary text-xl">Latest News</h3>
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="cursor-pointer rounded-lg bg-gray-800 p-4 transition hover:bg-gray-750"
								>
									<h4 className="mb-1 font-medium text-primary">
										Post-Match Analysis
									</h4>
									<p className="mb-2 text-gray-400 text-sm">
										Detailed analysis of the match performance and key
										moments...
									</p>
									<p className="text-gray-500 text-xs">2 hours ago</p>
								</div>
							))}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	if (isError) {
		return (
			<div className="mb-32 space-y-4 pb-10 lg:mb-0">
				<ErrorState
					message={
						isNetworkError ? "Network Error" : "Failed to load match details"
					}
					description={
						isNetworkError
							? "Please check your internet connection"
							: "Unable to load match information"
					}
					onRetry={refetch}
					isNetworkError={isNetworkError}
				/>
			</div>
		);
	}

	if (isLoading || !data) {
		return (
			<div className="mb-32 space-y-4 pb-10 lg:mb-0">
				<div className="flex flex-col items-center justify-center space-y-2 py-20">
					<Loader2 className="animate-spin" width={24} height={24} />
					<p className="text-gray-500 text-sm">Loading match details...</p>
				</div>
			</div>
		);
	}

	const match = data.match;

	const homeSetsWon = match.home_team.set_scores.filter(
		(set, idx) =>
			set.games_won > (match.away_team.set_scores[idx]?.games_won || 0),
	).length;

	const awaySetsWon = match.away_team.set_scores.filter(
		(set, idx) =>
			set.games_won > (match.home_team.set_scores[idx]?.games_won || 0),
	).length;

	let matchStatus: "live" | "finished" | "upcoming" = "upcoming";
	if (match.status === "live") {
		matchStatus = "live";
	} else if (match.status === "closed" || match.status === "ended") {
		matchStatus = "finished";
	}

	const competitionCountry =
		search.country || match.venue?.country || "International";
	const competitionName =
		match.competition?.name || match.venue?.name || "Tennis Match";

	return (
		<div className="space-y-3 pb-28 lg:pb-10">
			<div className="py-4 lg:py-0">
				<DetailsImageCard
					gameTabs={gameTabs}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					competitionCountry={competitionCountry}
					competitionName={competitionName}
					hostTeamName={match.home_team.competitor.name}
					hostTeamLogo="/Profile.png"
					matchStatus={
						matchStatus === "upcoming" && match.start_time
							? format(new Date(match.start_time), "yyyy-MM-dd HH:mm")
							: match.status === "closed"
								? "Finished"
								: match.status === "interrupted"
									? "Interrupted"
									: match.status
					}
					hostTeamScore={homeSetsWon}
					guestTeamScore={awaySetsWon}
					guestTeamLogo="/Profile.png"
					guestTeamName={match.away_team.competitor.name}
					isUpcoming={matchStatus === "upcoming"}
					countdownText={countdown}
					scheduledDate={
						match.start_time
							? format(safeParseDate(match.start_time), "dd/MM/yyyy")
							: undefined
					}
					scheduledTime={
						match.start_time
							? format(safeParseDate(match.start_time), "HH:mm")
							: undefined
					}
				/>
			</div>
			<div>{renderTabContent()}</div>
		</div>
	);
};

export default TennisDetailsPage;
