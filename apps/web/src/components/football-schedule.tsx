import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { useMemo, useTransition } from "react";
import BannerCarousel from "@/components/BannerCarousel";
import { useCurrentFilter } from "@/hooks/use-current-filter";
import { useFootballSchedule } from "@/hooks/use-fooball-schedule";
import { useFavorites } from "@/hooks/useFavorites";
import type { BannerData } from "@/lib/banners-server";
import type { Sport } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { MatchCard } from "@/shared/BasketballAccordionComponentCard";
import FixtureFilterHeaders from "@/shared/FixtureFilterHeaders";
import type { RootState } from "@/store";
import { useAppSelector } from "@/store/hook";
import { BetConverter } from "./bet-converter";
import { EmptyState } from "./EmptyState";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

interface FootballScheduleProps {
	banners?: BannerData[];
}

const FootballSchedule = ({ banners }: FootballScheduleProps) => {
	const { isFavoriteMatch, toggleFavoriteMatch } = useFavorites();
	// const router = useRouter();
	const search = useSearch({ from: "/" }) as {
		league?: string;
		sports?: Sport;
	};
	const navigate = useNavigate();
	const activeLeague = search.league;

	const selectedDateString = useAppSelector(
		(state: RootState) => state.date.selectedDate,
	);
	const selectedDate = new Date(selectedDateString);
	const { currentFilter } = useCurrentFilter();
	const [isPending] = useTransition();
	const { data: schedules, isLoading } = useFootballSchedule(
		`${selectedDate.getDate().toString().padStart(2, "0")}/${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}/${selectedDate.getFullYear()}`,
		"en",
	);

	const filtersCount = useMemo(() => {
		if (!schedules) {
			return {
				all: 0,
				live: 0,
				finished: 0,
				upcoming: 0,
			};
		}

		const all = schedules.total_matches;
		let live = 0;
		let finished = 0;
		let upcoming = 0;

		schedules.competitions.forEach((competition) => {
			competition.matches.forEach((match) => {
				if (match.match_status === "closed") {
					finished++;
				} else if (match.match_status === "SCH") {
					upcoming++;
				} else {
					live++;
				}
			});
		});

		return {
			all,
			live,
			finished,
			upcoming,
		};
	}, [schedules]);

	const filteredSchedules = useMemo(() => {
		if (!schedules) return null;

		if (currentFilter === "all") {
			return schedules;
		}

		const filteredCompetitions = [];

		for (const competition of schedules.competitions) {
			const matchingMatches = competition.matches.filter((match) => {
				// if (currentFilter === "all" || filter === "all") return true;
				if (currentFilter === "finished")
					return match.match_status === "closed";
				if (currentFilter === "upcoming")
					return match.match_status === "SCH" || match.match_status === "AET";
				if (currentFilter === "live")
					return (
						match.match_status !== "closed" &&
						match.match_status !== "SCH" &&
						match.match_status !== "AET" &&
						match.match_status !== "FTO"
					);
				return false;
			});

			if (matchingMatches.length > 0) {
				filteredCompetitions.push({
					...competition,
					matches: matchingMatches,
				});
			}
		}

		const finalCompetitions = activeLeague
			? filteredCompetitions.filter(
					(comp) => comp.competition.name === activeLeague,
				)
			: filteredCompetitions;

		return {
			...schedules,
			competitions: finalCompetitions,
		};
	}, [schedules, currentFilter, activeLeague]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<Loader2 className="animate-spin" width={24} height={24} />
				<p className="text-gray-500 text-sm">Loading matches...</p>
			</div>
		);
	}

	return (
		<div>
			<div className="sticky top-[-16px] z-10 hidden items-center justify-between bg-background/95 px-1 py-4 backdrop-blur-sm lg:flex">
				<FixtureFilterHeaders counts={filtersCount} />
			</div>
			{banners && banners.length > 0 && <BannerCarousel banners={banners} />}
			{isPending && (
				<div className="flex items-center justify-center py-4">
					<Loader2 className="mr-2 animate-spin" width={20} height={20} />
					<span className="text-gray-600 text-sm">Filtering matches...</span>
				</div>
			)}

			{activeLeague && !isLoading && (
				<div className="mb-4 flex items-center justify-between rounded-xl border border-accent/20 bg-accent/10 px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="font-medium text-primary text-sm">
							Filtered by:
						</span>
						<span className="font-bold text-accent text-sm">
							{activeLeague}
						</span>
					</div>
					<button
						onClick={() =>
							navigate({
								to: "/",
								search: { league: undefined, sports: search.sports },
							})
						}
						className="flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-accent text-xs transition-colors hover:bg-accent/20"
						type="button"
					>
						<X className="h-3 w-3" />
						Clear Filter
					</button>
				</div>
			)}

			{/* <BetConverter /> */}
			<div className="space-y-4">
				{filteredSchedules?.competitions.length === 0 ? (
					<EmptyState
						title={`No ${currentFilter === "all" ? "" : currentFilter} matches found`}
						description={`We couldn't find any matches matching your criteria for this date.`}
					/>
				) : (
					filteredSchedules?.competitions.map((competition) => (
						<Accordion
							key={`${competition.competition.id}`}
							type="single"
							collapsible={false}
							defaultValue={`${competition.competition.id}`}
						>
							<AccordionItem
								value={`${competition.competition.id}`}
								className="w-full rounded-2xl bg-white"
							>
								<Link
									to="/index/tournament/$tournamentId"
									params={{ tournamentId: competition.competition.id }}
								>
									<AccordionTrigger
										className="cursor-pointer rounded-none border-gray-100 px-4 font-bold text-primary [&[data-state=open]]:border-b"
										isCollapsible={false}
									>
										{competition.competition.name}
									</AccordionTrigger>
								</Link>

								<AccordionContent className="cursor-pointer overflow-hidden">
									<div>
										{competition.matches.map((match, index) => (
											<Link
												to="/index/$gameId"
												params={{ gameId: match.id }}
												key={`${index}+1`}
											>
												<MatchCard
													team1={match.competitors.home.name}
													team2={match.competitors.away.name}
													time={formatTime(new Date(match.start_time))}
													score1={match.competitors.home.score}
													score2={match.competitors.away.score}
													clock={match.clock}
													isFavorite={
														match.id ? isFavoriteMatch(match.id) : false
													}
													status={match.match_status}
													onFavoriteToggle={() =>
														toggleFavoriteMatch({
															id: match.id,
															team1: match.competitors.home.name,
															team2: match.competitors.away.name,
															sport: "football",
														})
													}
													id={match.id}
												/>
											</Link>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))
				)}
			</div>
		</div>
	);
};
export default FootballSchedule;
