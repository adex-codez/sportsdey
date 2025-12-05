import React, { useState } from "react";
import { TabNavigation } from "@/components/ui/tab-navigation";
import type { DetailsImageProps } from "@/types/basketball";

interface DetailsImageCardProps extends DetailsImageProps {
	competitionName: string;
	competitionCountry: string;
	hostTeamName: string;
	guestTeamName: string;
	hostTeamLogo?: string;
	guestTeamLogo?: string;
	guestTeamScore: number;
	hostTeamScore: number;
	matchStatus: string;
	isFavorite?: boolean;
	onFavoriteToggle?: () => {};
	activeTab: string;
	setActiveTab: (id: string) => void;
	gameTabs?: { id: string; label: string }[];
}

const DetailsImageCard = ({
	competitionName,
	competitionCountry,
	hostTeamName,
	guestTeamName,
	hostTeamLogo,
	guestTeamLogo,
	guestTeamScore,
	hostTeamScore,
	isFavorite = false,
	onFavoriteToggle,
	activeTab,
	setActiveTab,
	gameTabs,
	matchStatus,
}: DetailsImageCardProps) => {
	const defaultGameTabs = [
		{ id: "info", label: "Info" },
		{ id: "standings", label: "Standings" },
		{ id: "team-stats", label: "Team Stats" },
		{ id: "videos", label: "Videos" },
		{ id: "news", label: "News" },
	];
	return (
		<div className="relative h-64 w-full rounded-t-2xl rounded-b-0 bg-primary">
			<div className="h-full w-full">
				<div className="relative flex items-center justify-center py-4">
					<span className="font-semibold text-white text-xs md:text-sm">
						{competitionCountry} - {competitionName}
					</span>
					<button
						onClick={onFavoriteToggle}
						className={`absolute right-4 cursor-pointer border-none bg-transparent text-xl transition-colors ${
							isFavorite
								? "text-yellow-400"
								: "text-[#C8C8C8] hover:text-yellow-400"
						}`}
					>
						★
					</button>
				</div>
				<div className="mt-6 flex w-full items-center justify-center px-4 md:gap-x-8 md:px-6">
					<div className="flex w-full items-center lg:justify-end">
						<button
							onClick={onFavoriteToggle}
							className={`cursor-pointer border-none bg-transparent text-xl transition-colors ${
								isFavorite
									? "text-yellow-400"
									: "text-[#C8C8C8] hover:text-yellow-400"
							}`}
						>
							★
						</button>
						<div className="mx-4 flex flex-col items-center">
							{hostTeamLogo ? (
								<img
									src={hostTeamLogo}
									alt={hostTeamName}
									className="mx-auto h-16 w-16 object-contain"
								/>
							) : null}

							<span className="mt-2 block text-center font-normal text-[10px] text-white md:text-sm">
								{hostTeamName}
							</span>
						</div>
					</div>
					<div className="w-full">
						<div className="flex flex-col items-center gap-y-4">
							<span className="font-semibold text-base text-white md:text-3xl">
								{hostTeamScore} - {guestTeamScore}
							</span>
							<span className="mt-2 block text-center font-medium text-[#1BAA04] text-xs capitalize md:text-sm">
								{matchStatus}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-row-reverse items-center lg:justify-end">
						<button
							onClick={onFavoriteToggle}
							className={`cursor-pointer border-none bg-transparent text-xl transition-colors ${
								isFavorite
									? "text-yellow-400"
									: "text-[#C8C8C8] hover:text-yellow-400"
							}`}
						>
							★
						</button>
						<div className="mx-4 flex flex-col items-center">
							{guestTeamLogo ? (
								<img
									src={guestTeamLogo}
									alt={guestTeamName}
									className="mx-auto h-16 w-16 object-contain"
								/>
							) : null}

							<span className="mt-2 block text-center font-normal text-[10px] text-white md:text-sm">
								{guestTeamName}
							</span>
						</div>
					</div>
				</div>
			</div>

			<TabNavigation
				tabs={gameTabs ? gameTabs : defaultGameTabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				className="absolute bottom-0 left-0 h-[34px] w-full bg-[#2C2C2C] md:h-[39.6px]"
			/>
		</div>
	);
};

export default DetailsImageCard;
