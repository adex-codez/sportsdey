import React from "react";
import { Handshake, Volleyball } from "lucide-react";
import type { FootballMatchInfoType } from "@/types/football";

interface TopScorersProps {
	scorers: FootballMatchInfoType["top_scorers"];
}

export const TopScorers: React.FC<TopScorersProps> = ({ scorers }) => {
	if (!scorers || scorers.length === 0)
		return (
			<div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100 italic">
				Top scorers data not available for this match.
			</div>
		);
	return (
		<div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100 mb-10">
			<div className="flex justify-between items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
				<span className="text-primary font-bold text-sm">Top Scorers</span>
				<div className="flex gap-x-6 md:gap-x-10 mr-2 md:mr-6">
					<div className="flex items-center gap-1 text-[#8E8E8E] font-bold text-[10px] md:text-xs min-w-[40px] justify-center">
						<Volleyball className="size-3" />
						<span>GS</span>
					</div>
				</div>
			</div>

			<div className="divide-y divide-gray-100">
				{scorers.map((scorer, index) => (
					<div
						key={scorer.id}
						className="flex justify-between items-center px-4 py-3.5 hover:bg-gray-50/50 transition-colors"
					>
						<div className="flex items-center gap-4 flex-1 min-w-0">
							<span className="text-[#8E8E8E] font-bold text-xs md:text-sm w-4">
								{index + 1}
							</span>
							<div className="flex flex-col min-w-0">
								<span className="truncate text-primary font-bold text-sm md:text-base">
									{scorer.name}
								</span>
								<span className="truncate text-[#8E8E8E] text-[10px] md:text-xs font-medium">
									{scorer.team.name} ({scorer.team.abbreviation})
								</span>
							</div>
						</div>
						<div className="flex gap-x-6 md:gap-x-10 mr-2 md:mr-6">
							<span className="text-primary font-bold text-sm md:text-base w-10 text-center">
								{scorer.gs}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
