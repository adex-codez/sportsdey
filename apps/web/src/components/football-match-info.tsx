import { Loader2 } from "lucide-react";
import type { FootballMatchInfoType } from "@/types/football";

export const FootballMatchInfo = ({
	info,
	setTab,
}: {
	info: FootballMatchInfoType;
	setTab: (tab: string) => void;
}) => {
	return (
		<div className="space-y-4">
			<div className="rounded-2xl bg-white">
				<div className="grid grid-cols-[1.2rem_minmax(0,1fr)_repeat(6,4rem)] px-4 py-2 font-semibold">
					<p />
					<p className="truncate">Standings</p>
					<p className="text-center">P</p>
					<p className="text-center">W</p>
					<p className="text-center">D</p>
					<p className="text-center">L</p>
					<p className="text-center">GD</p>
					<p className="text-center">PTS</p>
				</div>

				{info.standings?.map((standing) => (
					<div
						key={standing.id}
						className="grid grid-cols-[1.2rem_minmax(0,1fr)_repeat(6,4rem)] border-gray-200 border-t px-4 py-2"
					>
						{/* Position */}
						<p className="text-gray-600">{standing.position}</p>

						{/* Team name — allow it to shrink */}
						<p className="min-w-0 overflow-hidden truncate text-primary">
							{standing.name}
						</p>

						<p className="text-center">{standing.played}</p>
						<p className="text-center">{standing.won}</p>
						<p className="text-center">{standing.drawn}</p>
						<p className="text-center">{standing.lost}</p>
						<p className="text-center">{standing.goal_diff}</p>
						<p className="text-center">{standing.points}</p>
					</div>
				))}
			</div>
			{/* <div className="rounded-2xl bg-white">
				<div className="flex px-4 py-2 font-semibold">
					<p className="truncate"> Form(Most Recent at Right)</p>
				</div>

				{info.competitors?.map((competitor) => (
					<div
						key={competitor.id}
						className="flex items-center justify-between border-gray-200 border-t px-4 py-2"
					>
						<p className="min-w-0 overflow-hidden truncate text-primary">
							{competitor.name}
						</p>

						<div>
							{competitor.qualifier === "home" ? (
								<div className="flex gap-4">
									{info.last5_home_results?.map((res) =>
										res.result === "win" ? (
											<div
												key={res.match_id}
												className="green-500 flex size-8 justify-center rounded-full bg-[#4EAC31] px-2 py-2"
											>
												W
											</div>
										) : res.result === "loss" ? (
											<div
												key={res.match_id}
												className="flex size-8 justify-center rounded-full bg-[#EB3343] px-2 py-2"
											>
												L
											</div>
										) : (
											<div
												key={res.match_id}
												className="flex size-8 justify-center rounded-full bg-[#EF8031] px-2 py-2"
											>
												D
											</div>
										),
									)}
								</div>
							) : (
								<div className="flex gap-4">
									{info.last5_away_results?.map((res) =>
										res.result === "win" ? (
											<div
												key={res.match_id}
												className="green-500 flex size-8 justify-center rounded-full bg-[#4EAC31] px-2 py-2"
											>
												W
											</div>
										) : res.result === "loss" ? (
											<div
												key={res.match_id}
												className="flex size-8 justify-center rounded-full bg-[#EB3343] px-2 py-2"
											>
												L
											</div>
										) : (
											<div
												key={res.match_id}
												className="flex size-8 justify-center rounded-full bg-[#EF8031] px-2 py-2"
											>
												D
											</div>
										),
									)}
								</div>
							)}
						</div>
					</div>
				))}
			</div> */}
			<div className="rounded-2xl bg-white">
				<p className="font-semibold px-4 py-2">Match Info</p>
					<div className="px-4 py-2 flex justify-between w-full border-gray-200 border-t"><p className="text-base">Date/Time</p><p>{info.match_info.date_time}</p></div>
					<div className="px-4 py-2 flex justify-between w-full border-gray-200 border-t"><p className="text-base">Stadium</p><p>{info.match_info.stadium}</p></div>
			</div>
		</div>
	);
};
