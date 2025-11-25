import { Loader2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { useFootballSchedule } from "@/hooks/use-fooball-schedule";
import type { FiltersType } from "@/lib/data";
import { formatTime } from "@/lib/utils";
import Favourite from "@/logos/favourite.svg?react";
import { useDateContext } from "./date-context";
import { DatePicker } from "./date-picker";
import { Filters } from "./filters";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";

const FootballSchedule = () => {
	const { date, setDate } = useDateContext();
	const [currentFilter, setCurrentFilter] = useState<FiltersType>("all");
	const [isPending, startTransition] = useTransition();
	const {
		data: schedules,
		isLoading,
		// error,
	} = useFootballSchedule(date.toISOString().split("T")[0], "en");

	const filtersCount = useMemo(() => {
		if (!schedules) {
			return {
				allCount: 0,
				liveCount: 0,
				finishedCount: 0,
				upcomingCount: 0,
			};
		}

		const allCount = schedules.total_matches;
		let liveCount = 0;
		let finishedCount = 0;
		let upcomingCount = 0;

		schedules.competitions.forEach((competition) => {
			competition.matches.forEach((match) => {
				switch (match.match_status) {
					case "live":
						liveCount++;
						break;
					case "closed":
						finishedCount++;
						break;
					case "not_started":
						upcomingCount++;
						break;
				}
			});
		});

		return {
			allCount,
			liveCount,
			finishedCount,
			upcomingCount,
		};
	}, [schedules]);

	const filteredSchedules = useMemo(() => {
		if (!schedules) return null;

		// If showing all matches, return original data
		if (currentFilter === "all") {
			return schedules;
		}

		// More efficient status mapping
		const statusMap: Record<FiltersType, string | null> = {
			live: "live",
			finished: "closed",
			upcoming: "not_started",
			all: null,
		};

		const targetStatus = statusMap[currentFilter];
		if (!targetStatus) return schedules;

		// Pre-filter and optimize the loop
		const filteredCompetitions = [];

		for (const competition of schedules.competitions) {
			const matchingMatches = [];

			for (const match of competition.matches) {
				if (match.match_status === targetStatus) {
					matchingMatches.push(match);
				}
			}

			if (matchingMatches.length > 0) {
				filteredCompetitions.push({
					...competition,
					matches: matchingMatches,
				});
			}
		}

		return {
			...schedules,
			competitions: filteredCompetitions,
		};
	}, [schedules, currentFilter]);

	if (isLoading || !schedules) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<Loader2 className="animate-spin" width={48} height={48} />
				<p className="text-gray-500 text-sm">Loading matches...</p>
			</div>
		);
	}

	const handleFilterChange = (filterValue: string) => {
		startTransition(() => {
			setCurrentFilter(filterValue as FiltersType);
		});
	};

	return (
		<div>
			<div className="flex items-center justify-between space-y-4">
				<Filters
					currentFilter={currentFilter}
					setCurrentFilter={handleFilterChange}
					filtersCount={filtersCount}
				/>
				<DatePicker date={date} setDate={setDate} />
			</div>
			{isPending && (
				<div className="flex items-center justify-center py-4">
					<Loader2 className="mr-2 animate-spin" width={20} height={20} />
					<span className="text-gray-600 text-sm">Filtering matches...</span>
				</div>
			)}
			<div className="space-y-4">
				{filteredSchedules?.competitions.map((competition) => (
					<Accordion
						key={`${competition.competition.id}`}
						type="single"
						collapsible
						defaultValue={`${competition.competition.id}`}
					>
						<AccordionItem
							value={`${competition.competition.id}`}
							className="w-full rounded-2xl bg-white"
						>
							<AccordionTrigger className="cursor-pointer rounded-none border-gray-100 px-4 font-bold text-primary [&[data-state=open]]:border-b">
								{competition.competition.name}
							</AccordionTrigger>
							<AccordionContent className="cursor-pointer overflow-hidden">
								<div>
									{competition.matches.map((match, index) => (
										<div
											className="flex justify-between border-gray-100 border-b px-4 py-4 hover:bg-gray-50"
											key={`${index}+1`}
										>
											<p>{formatTime(new Date(match.start_time))}</p>
											<div>
												{match.competitors[0].name} vs{" "}
												{match.competitors[1].name}
											</div>
											<div className="flex items-center gap-2">
												<div className="rounded-lg bg-[#EBEBEB] px-2 py-1">
													<p>
														1{" "}
														<span className="px-3 py-1 font-semibold">
															1.60
														</span>
													</p>
												</div>
												<div className="rounded-lg bg-[#EBEBEB] px-2 py-1">
													<p>
														X <span className="font-semibold">4.20</span>
													</p>
												</div>
												<div className="rounded-lg bg-[#EBEBEB] px-2 py-1">
													<p>
														2 <span className="font-semibold">4.20</span>
													</p>
												</div>
												<Favourite />
											</div>
										</div>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))}
			</div>
		</div>
	);
};
export default FootballSchedule;
