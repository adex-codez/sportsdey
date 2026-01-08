import type { FootballMatchInfoType } from "@/types/football";

type FootballStandingsProps = {
  standings: FootballMatchInfoType["standings"];
}
export const FootballStandings = ({ standings }: FootballStandingsProps) => {
  if(!standings) return null;
  return (
    <div className="rounded-2xl bg-white">
				<div className="flex justify-between items-center px-4 py-2 font-semibold">
					<div className="w-full">
						<span className="text-primary font-semibold text-sm truncate">
							Standings
						</span>
					</div>
					<div className="flex gap-x-4">
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							P
						</span>
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							W
						</span>
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							D
						</span>
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							L
						</span>
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							GD
						</span>
						<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
							PTS
						</span>
					</div>
				</div>

				{standings?.map((standing) => (
					<div
						key={standing.id}
						className="flex justify-center items-center border-gray-200 border-t px-4 py-2"
					>
						<div className="flex gap-6 w-full">
							<span className="text-gray-600">{standing.position}</span>
							<span className="min-w-0 overflow-hidden truncate text-primary">
								{standing.name}
							</span>
						</div>
						<div className="flex gap-x-4">
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.played}
							</span>
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.won}
							</span>
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.drawn}
							</span>
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.lost}
							</span>
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.goal_diff}
							</span>
							<span className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
								{standing.points}
							</span>
						</div>
					</div>
				))}
			</div>
  );
};