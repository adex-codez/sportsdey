import { useFootballBetting } from "@/hooks/use-football-betting";
import { formatDateTimeWithoutSeconds } from "@/lib/utils";
import type { FootballMatchInfoType } from "@/types/football";
import { FootballStandings } from "./football-league-standings";
import { BetWidget } from "./football-section/BetWidget";
import { H2HForm } from "./h2h-form";
import { SuperBets } from "./super-bet";
import { TopScorers } from "./top-scorers";

export const FootballMatchInfo = ({
	info,
}: {
	info: FootballMatchInfoType;
	setTab: (tab: string) => void;
}) => {
	const homeTeamName = info.competitors.home.name;
	const awayTeamName = info.competitors.away.name;

	const { data: bettingData } = useFootballBetting(
		homeTeamName,
		awayTeamName,
		info.competitors.home.shortName,
		info.competitors.away.shortName,
	);

	return (
		<div className="space-y-4">
			{bettingData && <BetWidget code={bettingData.code} />}
			<FootballStandings standings={info.standings} />
			{/* <SuperBets /> */}
			<H2HForm
				homeH2H={info.homeH2H}
				awayH2H={info.awayH2H}
				homeName={info.competitors.home.name}
				awayName={info.competitors.away.name}
			/>
			{info.top_scorers && info.top_scorers.length > 0 ? (
				<TopScorers scorers={info.top_scorers} />
			) : null}
			<div className="rounded-2xl bg-white dark:bg-card">
				<p className="px-4 py-2 font-semibold">Match Info</p>
				<div className="flex w-full justify-between border-gray-200 border-t px-4 py-2">
					<p className="text-base">Date/Time</p>
					<p>{formatDateTimeWithoutSeconds(info.match_info.date_time)}</p>
				</div>
				<div className="flex w-full justify-between border-gray-200 border-t px-4 py-2">
					<p className="text-base">Stadium</p>
					<p>{info.match_info.stadium}</p>
				</div>
			</div>
		</div>
	);
};
