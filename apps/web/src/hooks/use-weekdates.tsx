import { useMemo } from "react";

export default function useWeekDates(date?: Date) {
	return useMemo(() => {
		const d = date ?? new Date();
		const day = d.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
		const mondayOffset = day === 0 ? -6 : 1 - day;

		const monday = new Date(d);
		monday.setDate(d.getDate() + mondayOffset);

		const week = [];

		for (let i = 0; i < 7; i++) {
			const current = new Date(monday);
			current.setDate(monday.getDate() + i);
			week.push(current);
		}

		return week;
	}, [date]); // recompute only when the date changes
}
