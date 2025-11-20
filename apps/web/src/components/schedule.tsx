import { useState } from "react";
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
		id: 1,
		filter: "upcoming",
	},
];
const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		day: "2-digit",
		month: "long",
	}).format(date);
};

const Schedule = () => {
	const [date, setDate] = useState<Date>(new Date());
	const [open, setOpen] = useState(false);
	return (
		<div>
			<div className="items-center justify-between space-y-4 lg:flex">
				<div className="flex justify-center gap-4 overflow-x-hidden lg:block">
					{filters.map((filter) => (
						<div
							key={filter.id}
							className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white p-2 md:px-4 md:py-2"
						>
							<p>
								{filter.filter.charAt(0).toUpperCase() +
									filter.filter.slice(1)}{" "}
							</p>
							<div className="flex size-8 items-center justify-center rounded-full bg-primary text-secondary text-sm">
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
						/>
					</Popover>
				</div>
			</div>
		</div>
	);
};

export default Schedule;
