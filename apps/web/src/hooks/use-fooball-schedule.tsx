import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { FootballSchedule } from "@/types/football";
export function useFootballSchedule(date: string, lang: string) {
	return useQuery({
		queryKey: ["football-schedule", date, lang],
		queryFn: () => {
			const endpoint = `football/schedule/${date}/${lang}`;
			return apiRequest<FootballSchedule>(endpoint);
		},
	});
}
