
import type { FootballMatchInfoType } from "@/types/football";
import { TopScorers } from "./top-scorers";
import { formatDateTimeWithoutSeconds } from "@/lib/utils";


export const FootballMatchInfo = ({
	info,
	setTab
}: {
	info: FootballMatchInfoType;
	setTab: (tab: string) => void;
}) => {
	return (
		<div className="space-y-4">
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

				{info.standings?.map((standing) => (
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
			<div className="rounded-2xl bg-white">
				<div className="flex px-4 py-2 font-semibold">
					<p className="truncate"> Form(Most Recent at Right)</p>
				</div>
				<div className="flex items-center justify-between border-gray-200 border-t px-4 py-2">
					<p className="min-w-0 overflow-hidden truncate text-primary">
						{info.competitors.home.name}
					</p>
					<div className="flex items-center gap-3">
						{info.homeH2H?.map((match) => (
							<div
								key={match.id}
								className="flex size-6 p-2 items-center justify-center rounded-full text-xs font-normal cursor-pointer text-white"
								style={{
									backgroundColor:
										match.result === "win"
											? "#4EAC31"
											: match.result === "loss"
												? "#EB3343"
												: "#EF8031",
								}}
							>
								{match.result === "win" ? "W" : match.result === "loss" ? "L" : "D"}
							</div>
						))}
					</div>
				</div>
				<div className="flex items-center justify-between border-gray-200 border-t px-4 py-2">
					<p className="min-w-0 overflow-hidden truncate text-primary">
						{info.competitors.away.name}
					</p>

					<div>
						<div className="flex items-center gap-3">
							{info.awayH2H?.map((match) => (
								<div
									key={match.id}
									className="flex cursor-pointer p-2 size-6 items-center justify-center rounded-full text-xs font-normal text-white"
									style={{
										backgroundColor:
											match.result === "win"
												? "#4EAC31"
												: match.result === "loss"
													? "#EB3343"
													: "#EF8031",
									}}
								>
									{match.result === "win" ? "W" : match.result === "loss" ? "L" : "D"}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{info.top_scorers && info.top_scorers.length > 0 && (
				<TopScorers scorers={info.top_scorers} />
			)}
			<div className="rounded-2xl bg-white">
				<p className="font-semibold px-4 py-2">Match Info</p>
				<div className="px-4 py-2 flex justify-between w-full border-gray-200 border-t">
					<p className="text-base">Date/Time</p>
					<p>{formatDateTimeWithoutSeconds(info.match_info.date_time)}</p>
				</div>
				<div className="px-4 py-2 flex justify-between w-full border-gray-200 border-t">
					<p className="text-base">Stadium</p>
					<p>{info.match_info.stadium}</p>
				</div>
			</div>
		</div>
	);
};
