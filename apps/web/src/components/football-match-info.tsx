
import type { FootballMatchInfoType } from "@/types/football";
import { TopScorers } from "./top-scorers";
import { formatDateTimeWithoutSeconds } from "@/lib/utils";
import { H2HForm } from "./h2h-form";
import { FootballStandings } from "./football-league-standings";


export const FootballMatchInfo = ({
	info,
}: {
	info: FootballMatchInfoType;
	setTab: (tab: string) => void;
}) => {
	return (
		<div className="space-y-4">
			<FootballStandings standings={info.standings} />	
			<H2HForm homeH2H={info.homeH2H} awayH2H={info.awayH2H} homeName={info.competitors.home.name} awayName={info.competitors.away.name} />
			{info.top_scorers && info.top_scorers.length > 0 ? (
				<TopScorers scorers={info.top_scorers} />
			) : null}
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
