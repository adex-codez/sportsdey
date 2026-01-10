import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useFootballSchedule, useTournamentFootballSchedule } from "@/hooks/use-fooball-schedule";
import type { FiltersType } from "@/lib/data";
import { formatTime } from "@/lib/utils";
import { Filters } from "@/components/filters";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/EmptyState";
import { useAppSelector } from "@/store/hook";
import type { RootState } from "@/store";
import { useFavorites } from "@/hooks/useFavorites";
import { MatchCard } from "@/shared/BasketballAccordionComponentCard";
import { useCurrentFilter } from "@/hooks/use-current-filter";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/index/tournament/$tournamentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {tournamentId} = Route.useParams();
const { isFavoriteMatch, toggleFavoriteMatch } = useFavorites();
	// const search = useSearch({ from: "/" }) as {
	// 	league?: string;
	// 	sports?: string;
	// }
	// const navigate = useNavigate();

	const selectedDateString = useAppSelector(
		(state: RootState) => state.date.selectedDate,
	)
	const selectedDate = new Date(selectedDateString);
	const { currentFilter, changeCurrentFilter } = useCurrentFilter();
	const [isPending, startTransition] = useTransition();
	const { data: schedules, isLoading } = useTournamentFootballSchedule(
		`${selectedDate.getDate().toString().padStart(2, `0`)}/${(selectedDate.getMonth() + 1).toString().padStart(2, `0`)}/${selectedDate.getFullYear()}`,
		tournamentId,
	)

	const filtersCount = useMemo(() => {
		if (!schedules) {
			return {
				allCount: 0,
				liveCount: 0,
				finishedCount: 0,
				upcomingCount: 0,
			}
		}

		const allCount = schedules.total_matches;
		let liveCount = 0;
		let finishedCount = 0;
		let upcomingCount = 0;

		schedules.matches.forEach((match) => {
				if (match.match_status === "closed") {
					finishedCount++;
				} else if (match.match_status === "SCH") {
					upcomingCount++;
				} else {
					liveCount++
				}
			})

		return {
			allCount,
			liveCount,
			finishedCount,
			upcomingCount,
		}
	}, [schedules]);

	const filteredSchedules = useMemo(() => {
		if (!schedules) return null;

		if (currentFilter === "all") {
			return schedules;
		}

		const filteredMatches = [];

    const matchingMatches = schedules.matches.filter((match) => {
      // if (currentFilter === "all" || filter === "all") return true;
      if (currentFilter === "finished")
        return match.match_status === "closed";
      if (currentFilter === "upcoming") return match.match_status === "SCH" || match.match_status === "AET";
      if (currentFilter === "live")
        return (
          match.match_status !== "closed" && match.match_status !== "SCH" && match.match_status !== "AET" && match.match_status !== "FTO"
        );
      return false;
    });

    if (matchingMatches.length > 0) {
      filteredMatches.push({
        ...matchingMatches,
      });
    }


		return {
			...schedules,
			matches: matchingMatches,
		}
	}, [schedules, currentFilter]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<Loader2 className="animate-spin" width={24} height={24} />
				<p className="text-gray-500 text-sm">Loading matches...</p>
			</div>
		)
	}

	const handleFilterChange = (filterValue: string) => {
		startTransition(() => {
			changeCurrentFilter(filterValue as any);
		})
	}

	return (
		<div>
			<div className="sticky top-[-16px] z-10 bg-background/95 backdrop-blur-sm px-1 py-4 flex items-center justify-between">
				<Filters
					currentFilter={currentFilter}
					setCurrentFilter={handleFilterChange}
					filtersCount={filtersCount}
				/>
				{/* <DatePicker date={date} setDate={setDate} /> */}
			</div>
			{isPending && (
				<div className="flex items-center justify-center py-4">
					<Loader2 className="mr-2 animate-spin" width={20} height={20} />
					<span className="text-gray-600 text-sm">Filtering matches...</span>
				</div>
			)}

			{/* {activeLeague && !isLoading && (
				<div className="flex items-center justify-between bg-accent/10 border border-accent/20 px-4 py-3 rounded-xl mb-4">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-primary">
							Filtered by:
						</span>
						<span className="text-sm font-bold text-accent">
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
						className="flex items-center gap-1 text-xs font-bold text-accent hover:bg-accent/20 px-2 py-1 rounded-lg transition-colors"
						type="button"
					>
						<X className="w-3 h-3" />
						Clear Filter
					</button>
				</div>
			)} */}
			<Accordion
							key={`${filteredSchedules?.competition.id}`}
							type="single"
							collapsible={false}
							defaultValue={`${filteredSchedules?.competition.id}`}
						>
							<AccordionItem
								value={`${filteredSchedules?.competition.id}`}
								className="w-full rounded-2xl bg-white"
							>
								
									<AccordionTrigger className="cursor-pointer rounded-none border-gray-100 px-4 font-bold text-primary [&[data-state=open]]:border-b">
										{filteredSchedules?.competition.name}
									</AccordionTrigger>
								
								<AccordionContent className="cursor-pointer overflow-hidden">
								<div className="space-y-4">
									{filteredSchedules?.matches.length === 0 ? (
										<EmptyState
											title={`No ${currentFilter === `all` ? `` : currentFilter} matches found`}
						description={`We couldn't find any matches matching your criteria for this date.`}
					/>
				) : (
          filteredSchedules?.matches.map((match, index) => (
						<div className="w-full rounded-2xl bg-white">
							<Link
								to="/index/$gameId"
								params={{ gameId: match.id }}
								key={`${index}+1`}
							>
								<MatchCard
									team1={match.competitors.home.name}
									team2={match.competitors.away.name}
									time={formatTime(new Date(match.date))}
									score1={match.competitors.home.score}
									score2={match.competitors.away.score}
									clock={match.clock?.played}
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
						</div>
						
          ))
        )}
			</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
		</div>
  )
}
