import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		day: "2-digit",
		month: "long",
	}).format(date);
};
export const DatePicker = ({
	date,
	setDate,
}: {
	date: Date;
	setDate: (date: Date) => void;
}) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="hidden justify-center lg:block">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="h-8 w-full cursor-pointer rounded-2xl bg-white px-4 py-2 text-center font-semibold text-sm active:scale-95">
						{formatDate(date)}
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0" align="start">
					<Calendar mode="single" selected={date} onSelect={setDate} required />
				</PopoverContent>
			</Popover>
		</div>
	);
};
