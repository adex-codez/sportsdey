import { Handshake, Volleyball } from "lucide-react";
import type React from "react";
import type { FootballMatchInfoType } from "@/types/football";

interface TopScorersProps {
	scorers: FootballMatchInfoType["top_scorers"];
	showAll?: boolean;
}

export const TopScorers: React.FC<TopScorersProps> = ({
	scorers,
	showAll = false,
}) => {
	if (!scorers || scorers.length === 0)
		return (
			<div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-gray-400 italic dark:bg-gray dark:text-white">
				Top scorers data not available for this match.
			</div>
		);
	const displayScorers = showAll ? scorers : scorers.slice(0, 3);

	return (
		<div className="mb-10 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-0 dark:bg-card">
			<div className="flex items-center justify-between border-gray-100 border-b bg-gray-50/50 px-4 py-3 dark:border-[#5A5F63] dark:bg-card">
				<span className="font-bold text-primary text-sm dark:text-white">
					Top Scorers
				</span>
				<div className="mr-2 flex gap-x-6 md:mr-6 md:gap-x-10">
					<div className="flex min-w-[40px] items-center justify-center gap-1 font-bold text-[#8E8E8E] text-[10px] md:text-xs dark:text-white">
						<Volleyball className="size-3" />
						<span>GS</span>
					</div>
				</div>
			</div>

			<div className="divide-y divide-gray-100 dark:divide-[#5A5F63]">
				{displayScorers.map((scorer, index) => (
					<div
						key={scorer.id}
						className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50/50"
					>
						<div className="flex min-w-0 flex-1 items-center gap-4">
							<span className="w-4 font-bold text-[#8E8E8E] text-xs md:text-sm dark:text-white">
								{index + 1}
							</span>
							<div className="flex min-w-0 flex-col">
								<span className="truncate font-bold text-primary text-sm md:text-base dark:text-white">
									{scorer.name}
								</span>
								<span className="truncate font-medium text-[#8E8E8E] text-[10px] md:text-xs dark:text-white">
									{scorer.team.name} ({scorer.team.abbreviation})
								</span>
							</div>
						</div>
						<div className="mr-2 flex gap-x-6 md:mr-6 md:gap-x-10">
							<span className="w-10 text-center font-bold text-primary text-sm md:text-base dark:text-white">
								{scorer.gs}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
