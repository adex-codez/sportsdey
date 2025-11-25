import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useFootballSchedule } from "@/hooks/use-fooball-schedule";
import type { FiltersType } from "@/lib/data";
import { formatTime } from "@/lib/utils";
import { useDateContext } from "./date-context";
import { Filters } from "./filters";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./ui/accordion";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		day: "2-digit",
		month: "long",
	}).format(date);
};

const FootballSchedule = () => {
	const { date, setDate } = useDateContext();
	const [open, setOpen] = useState(false);
	const [currentFilter, setCurrentFilter] = useState<FiltersType>("all");
	const [filterCount, setFilterCount] = useState({
		allCount: 0,
		liveCount: 0,
		finishedCount: 0,
		upcomingCount: 0,
	});
	const {
		data: schedules,
		isLoading,
		// error,
	} = useFootballSchedule(date.toISOString().split("T")[0], "en");
	if (isLoading || !schedules) {
		return (
			<div className="flex justify-center">
				<Loader2 className="animate-spin" width={48} height={48} />
			</div>
		);
	}

	return (
		<div>
			<div className="items-center justify-between space-y-4 lg:flex">
				<Filters
					currentFilter={currentFilter}
					setCurrentFilter={setCurrentFilter}
				/>
				<div className="flex justify-center lg:block">
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<div className="w- cursor-pointer rounded-2xl bg-white px-6 py-2 text-center active:scale-95 lg:w-full">
								{formatDate(date)}
							</div>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto overflow-hidden p-0"
							align="start"
						>
							<Calendar
								mode="single"
								selected={date}
								onSelect={setDate}
								required
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			<div className="space-y-4">
				{schedules?.competitions.map((competition) => (
					<Accordion
						key={`${competition.competition.id}`}
						type="single"
						collapsible
					>
						<AccordionItem
							value={`${competition.competition.id}`}
							className="w-full rounded-2xl bg-white px-4"
						>
							<AccordionTrigger>
								{competition.competition.name}
							</AccordionTrigger>
							<AccordionContent>
								<div>
									{competition.matches.map((match, index) => (
										<div className="flex justify-between" key={`${index}+1`}>
											<p>{formatTime(new Date(match.start_time))}</p>
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
