import { TabNavigation } from "@/components/ui/tab-navigation";
import { formatClock } from "@/lib/utils";
import type { DetailsImageProps } from "@/types/basketball";

interface DetailsImageCardProps extends DetailsImageProps {
	competitionName: string;
	competitionCountry: string;
	hostTeamName: string;
	guestTeamName: string;
	hostTeamLogo: string;
	guestTeamLogo: string;
	guestTeamScore: number;
	hostTeamScore: number;
	matchStatus: string;
	isFavorite?: boolean;
	onFavoriteToggle?: () => void;
	isHomeFavorite?: boolean;
	onToggleHomeFavorite?: () => void;
	isAwayFavorite?: boolean;
	onToggleAwayFavorite?: () => void;
	activeTab: string;
	setActiveTab: (id: string) => void;
	gameTabs: { id: string; label: string }[];
	isUpcoming?: boolean;
	countdownText?: string;
	scheduledDate?: string;
	scheduledTime?: string;
	clock?: number | string;
}

const DetailsImageCard = ({
	competitionName,
	competitionCountry,
	clock,
	hostTeamName,
	guestTeamName,
	hostTeamLogo,
	guestTeamLogo,
	guestTeamScore,
	hostTeamScore,
	isFavorite = false,
	onFavoriteToggle,
	isHomeFavorite = false,
	onToggleHomeFavorite,
	isAwayFavorite = false,
	onToggleAwayFavorite,
	activeTab,
	setActiveTab,
	gameTabs,
	matchStatus,
	isUpcoming = false,
	countdownText,
	scheduledDate,
	scheduledTime,
}: DetailsImageCardProps) => {
	return (
		<div className="relative h-64 w-full rounded-t-2xl rounded-b-0 bg-primary dark:bg-card">
			<div className="h-full w-full">
				<div className="relative flex items-center justify-center py-4">
					<span className="block max-w-[65%] truncate font-semibold text-white text-xs sm:max-w-[75%] md:text-sm">
						{competitionCountry
							? `${competitionCountry} - ${competitionName}`
							: competitionName}
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
							onClick={onToggleHomeFavorite}
							className={`cursor-pointer border-none bg-transparent text-xl transition-colors ${
								isHomeFavorite
									? "text-yellow-400"
									: "text-[#C8C8C8] hover:text-yellow-400"
							}`}
						>
							★
						</button>
						<div className="mx-4 flex flex-col items-center">
							<img
								src={hostTeamLogo}
								alt={hostTeamName}
								className="mx-auto h-16 w-16 object-contain"
							/>
							<span className="mt-2 block flex h-8 items-start justify-center text-center font-normal text-[10px] text-white md:h-auto md:text-sm">
								{hostTeamName}
							</span>
						</div>
					</div>
					<div className="w-full">
						<div className="flex flex-col items-center gap-y-1.5">
							{isUpcoming ? (
								<>
									{scheduledDate && (
										<span className="font-medium text-white text-xs md:text-sm">
											{scheduledDate}
										</span>
									)}
									{scheduledTime && (
										<span className="font-bold text-base text-white md:text-2xl">
											{scheduledTime}
										</span>
									)}
									{countdownText && (
										<span className="mt-1 space-y-1 text-center font-semibold text-[#1BAA04] text-[10px] md:text-sm">
											Starts in <br />
											{countdownText}
										</span>
									)}
								</>
							) : (
								<>
									<span
										className={`font-semibold text-base transition-colors duration-300 md:text-3xl ${
											matchStatus?.toLowerCase() !== "finished a.e.t." &&
											matchStatus?.toLowerCase() !== "finished" &&
											matchStatus?.toLowerCase() !== "full time" &&
											matchStatus?.toLowerCase() !== "ft"
												? "animate-pulse text-[#0E8F1A]"
												: "text-white"
										}`}
									>
										{hostTeamScore} - {guestTeamScore}
									</span>
									<span
										className={`mt-2 block text-center font-medium text-xs capitalize transition-colors duration-300 md:text-sm ${
											matchStatus?.toLowerCase() !== "finished a.e.t." &&
											matchStatus?.toLowerCase() !== "finished" &&
											matchStatus?.toLowerCase() !== "full time" &&
											matchStatus?.toLowerCase() !== "ft"
												? "text-[#0E8F1A]"
												: "text-[#1BAA04]"
										}`}
									>
										{clock && clock !== ""
											? formatClock(clock)
											: matchStatus?.toLowerCase() === "finished a.e.t." ||
													matchStatus?.toLowerCase() === "finished" ||
													matchStatus?.toLowerCase() === "ft"
												? "Closed"
												: matchStatus}
									</span>
								</>
							)}
						</div>
					</div>
					<div className="flex w-full flex-row-reverse items-center lg:justify-end">
						<button
							onClick={onToggleAwayFavorite}
							className={`cursor-pointer border-none bg-transparent text-xl transition-colors ${
								isAwayFavorite
									? "text-yellow-400"
									: "text-[#C8C8C8] hover:text-yellow-400"
							}`}
						>
							★
						</button>
						<div className="mx-4 flex flex-col items-center">
							<img
								src={guestTeamLogo}
								alt={guestTeamName}
								className="mx-auto h-16 w-16 object-contain"
							/>
							<span className="mt-2 block flex h-8 items-start justify-center text-center font-normal text-[10px] text-white md:h-auto md:text-sm">
								{guestTeamName}
							</span>
						</div>
					</div>
				</div>
			</div>

			<TabNavigation
				tabs={gameTabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				className="absolute bottom-0 left-0 h-[34px] w-full bg-[#2C2C2C] md:h-[39.6px]"
			/>
		</div>
	);
};

export default DetailsImageCard;
