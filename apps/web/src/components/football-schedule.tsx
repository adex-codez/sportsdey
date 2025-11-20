import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const filters = [
	{
		id: 1,
		filter: "all",
	},
	{
		id: 2,
		filter: "live",
	},
	{
		id: 3,
		filter: "finished",
	},
	{
		id: 4,
		filter: "upcoming",
	},
] satisfies { id: number; filter: string }[];
const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		day: "2-digit",
		month: "long",
	}).format(date);
};

const FootballSchedule = () => {
	const [date, setDate] = useState<Date>(new Date());
	const [open, setOpen] = useState(false);
	const [currentFilter, setCurrentFilter] =
		useState<(typeof filters)[number]["filter"]>("all");
	return (
		<div>
			<div className="items-center justify-between space-y-4 lg:flex">
				<div className="flex flex-wrap justify-center gap-4">
					{filters.map((filter) => (
						<div
							key={filter.id}
							onClick={() => setCurrentFilter(filter.filter)}
							className={cn(
								"flex cursor-pointer items-center gap-2 rounded-2xl bg-white p-2 md:px-4 md:py-2",
								filter.filter === currentFilter ? "bg-accent text-white" : null,
							)}
						>
							<p>
								{filter.filter.charAt(0).toUpperCase() +
									filter.filter.slice(1)}{" "}
							</p>
							<div
								className={cn(
									"flex size-8 items-center justify-center rounded-full bg-primary text-secondary text-sm",
									filter.filter === currentFilter ? "bg-[#456041]" : null,
								)}
							>
								0
							</div>
						</div>
					))}
				</div>
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
			<div />
		</div>
	);
};

export default FootballSchedule;
