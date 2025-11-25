import { Loader2, Star } from "lucide-react";
import { useMemo, useState } from "react";
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

		// Filter matches based on currentFilter
		const getMatchStatus = (filter: FiltersType) => {
			switch (filter) {
				case "live":
					return "live";
				case "finished":
					return "closed";
				case "upcoming":
					return "not_started";
				default:
					return null;
			}
		};

		const targetStatus = getMatchStatus(currentFilter);
		if (!targetStatus) return schedules;

		// Create filtered competitions with only matching matches
		const filteredCompetitions = schedules.competitions
			.map((competition) => ({
				...competition,
				matches: competition.matches.filter(
					(match) => match.match_status === targetStatus,
				),
			}))
			// Only include competitions that have matching matches
			.filter((competition) => competition.matches.length > 0);

		return {
			...schedules,
			competitions: filteredCompetitions,
		};
	}, [schedules, currentFilter]);

	if (isLoading || !schedules) {
		return (
			<div className="flex justify-center">
				<Loader2 className="animate-spin" width={48} height={48} />
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between space-y-4">
				<Filters
					currentFilter={currentFilter}
					setCurrentFilter={setCurrentFilter}
					filtersCount={filtersCount}
				/>
				<DatePicker date={date} setDate={setDate} />
			</div>
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
