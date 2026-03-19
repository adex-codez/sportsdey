"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FootballStanding } from "@/types/football";
import { getTeamInitials } from "@/utils/getTeamLogo";

interface FootballStandingsTabProps {
	teams: FootballStanding[];
	className?: string;
	homeTeam?: string;
	awayTeam?: string;
	isLoading?: boolean;
}

function StandingsView({ teams }: { teams: FootballStanding[] }) {
	return (
		<div className="max-w-screen rounded-xl border-0 bg-white py-4 shadow-xs dark:bg-card">
			<div className="no-scrollbar max-w-[calc(100vw-2rem)] overflow-x-auto md:max-w-none">
				<table className="w-full text-sm">
					<thead>
						<tr className="text-[10px] text-primary dark:text-white">
							<th className="sticky left-0 z-20 w-[50px] bg-white py-2 text-center dark:bg-card" />
							<th className="sticky left-[50px] z-20 bg-white py-2 pr-4 text-left font-medium text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:bg-card">
								Standings
							</th>
							<th className="px-2 py-2 text-center font-medium">P</th>
							<th className="px-2 py-2 text-center font-medium">W</th>
							<th className="px-2 py-2 text-center font-medium">D</th>
							<th className="px-2 py-2 text-center font-medium">L</th>
							<th className="px-2 py-2 text-center font-medium">GD</th>
							<th className="px-2 py-2 text-center font-medium">PTS</th>
						</tr>
					</thead>
					<tbody>
						{teams.map((team, index) => {
							const [logoError, setLogoError] = useState(false);
							const [logoLoading, setLogoLoading] = useState(true);
							const logoUrl = team.imageUrl || "/Profile.png";

							return (
								<tr
									key={index}
									className={cn(
										"border-[#C8C8C8] border-t",
										team.isHighlighted
											? "bg-[#EDF6EB] dark:bg-[#5A5F63]"
											: "bg-white dark:bg-card",
									)}
								>
									<td
										className={cn(
											"sticky left-0 z-10 w-[50px] py-2.5 text-center text-[11.92px]",
											team.isHighlighted
												? "bg-[#EDF6EB] text-[#1BAA04] dark:bg-[#5A5F63]"
												: "bg-white text-primary dark:bg-card dark:text-white",
											[1, 2, 3, 4].includes(team.position)
												? "border-[#1BBD2A] border-l-4"
												: [5, 6].includes(team.position)
													? "border-[#E5A400] border-l-4"
													: "",
										)}
									>
										{team.position}
									</td>
									<td
										className={cn(
											"sticky left-[50px] z-10 whitespace-nowrap py-2.5 pr-4 font-medium text-[11.92px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
											team.isHighlighted
												? "bg-[#EDF6EB] text-[#1BAA04] dark:bg-[#5A5F63]"
												: "bg-white text-primary dark:bg-card dark:text-white",
										)}
									>
										<div className="flex items-center gap-2">
											{logoLoading && !logoError ? (
												<Skeleton className="size-6 rounded-full" />
											) : !logoError && logoUrl !== "/Profile.png" ? (
												<img
													src={logoUrl}
													alt={team.name}
													className="size-6 object-contain"
													onLoad={() => setLogoLoading(false)}
													onError={() => {
														setLogoError(true);
														setLogoLoading(false);
													}}
												/>
											) : (
												<div className="flex size-6 items-center justify-center rounded-full border border-gray-200 bg-gray-100 font-bold text-[9px] text-gray-400 dark:border-[#5A5F63] dark:bg-card dark:text-white">
													{getTeamInitials(team.name)}
												</div>
											)}
											<span>{team.name}</span>
										</div>
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.P}
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.W}
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.D}
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.L}
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.GD}
									</td>
									<td
										className={cn(
											"px-2 py-2.5 text-center text-[10.21px]",
											team.isHighlighted
												? "text-[#1BAA04]"
												: "text-primary dark:text-white",
										)}
									>
										{team.statistics.PTS}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function FootballStandingsTab({
	teams,
	className,
	homeTeam,
	awayTeam,
	isLoading,
}: FootballStandingsTabProps) {
	const isTeamHighlighted = (teamName: string) => {
		if (!homeTeam && !awayTeam) return false;
		return teamName === homeTeam || teamName === awayTeam;
	};

	const enhancedTeams = teams.map((team) => ({
		...team,
		isHighlighted: isTeamHighlighted(team.name),
	}));

	if (isLoading) {
		return (
			<div className={cn("rounded-lg", className)}>
				<div className="rounded-xl bg-white p-8 text-center dark:bg-card">
					<div className="animate-pulse space-y-4">
						<div className="mx-auto h-4 w-3/4 rounded bg-gray-200 dark:bg-card" />
						<div className="h-4 rounded bg-gray-200 dark:bg-card" />
						<div className="h-4 rounded bg-gray-200 dark:bg-card" />
						<div className="h-4 rounded bg-gray-200 dark:bg-card" />
					</div>
				</div>
			</div>
		);
	}

	if (!teams || teams.length === 0) {
		return (
			<div className={cn("rounded-lg", className)}>
				<div className="rounded-xl bg-white p-8 text-center text-gray-400 italic dark:bg-card dark:text-white">
					No standings data available.
				</div>
			</div>
		);
	}

	return (
		<div className={cn("rounded-lg", className)}>
			<StandingsView teams={enhancedTeams} />
		</div>
	);
}

export default FootballStandingsTab;
