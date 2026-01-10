import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { FootballSchedule, TournamentFootballSchedule } from "@/types/football";
export function useFootballSchedule(date: string, lang: string) {
	return useQuery({
		queryKey: ["football-schedule", date, lang],
		refetchInterval: 5 * 60 * 1000,
		retry: true,
		queryFn: () => {
			const endpoint = `football/all?date=${date}&lang=${lang}`;
			return apiRequest<FootballSchedule>(endpoint);
		},
	});
}

export function useTournamentFootballSchedule(date: string, tournamentId: string) {
	return useQuery({
		queryKey: ["tournament-football-schedule", date, tournamentId],
		refetchInterval: 5 * 60 * 1000,
		retry: true,
		queryFn: () => {
			const endpoint = `football/tournament/${tournamentId}?date=${date}`;
			return apiRequest<TournamentFootballSchedule>(endpoint);
		},
	});
}