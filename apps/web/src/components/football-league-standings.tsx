import type { FootballMatchInfoType } from "@/types/football";

type FootballStandingsProps = {
	standings: FootballMatchInfoType["standings"];
};
export const FootballStandings = ({ standings }: FootballStandingsProps) => {
	if (!standings || standings.length === 0) return null;
	return (
		<div className="rounded-2xl bg-white dark:bg-card">
			<div className="flex items-center justify-between px-4 py-2 font-semibold">
				<div className="w-full">
					<span className="truncate font-semibold text-primary text-sm dark:text-white">
						Standings
					</span>
				</div>
				<div className="flex gap-x-4">
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						P
					</span>
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						W
					</span>
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						D
					</span>
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						L
					</span>
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						GD
					</span>
					<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
						PTS
					</span>
				</div>
			</div>

			{standings?.map((standing) => (
				<div
					key={standing.id}
					className="flex items-center justify-center border-gray-200 border-t px-4 py-2"
				>
					<div className="flex w-full gap-6">
						<span className="text-gray-600 dark:text-white">
							{standing.position}
						</span>
						<span className="min-w-0 overflow-hidden truncate text-primary dark:text-white">
							{standing.name}
						</span>
					</div>
					<div className="flex gap-x-4">
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.played}
						</span>
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.won}
						</span>
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.drawn}
						</span>
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.lost}
						</span>
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.goal_diff}
						</span>
						<span className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14 dark:text-white">
							{standing.points}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};
