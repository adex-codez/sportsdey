import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { FootballMatchInfoType } from "@/types/football";
export function useFootballMatchInfo(gameId: string, lang: string) {
	return useQuery({
		queryKey: ["football-match-info", gameId, lang],
		queryFn: () => {
			const endpoint = `football/match/${encodeURIComponent(gameId)}?lang=${lang}`;
			return apiRequest<FootballMatchInfoType>(endpoint);
		},
		retry: true,
		refetchInterval: (query) => {
			return query.state.data?.status === "finished" ? 2 * 60 * 1000 : 5000;
		},
	});
}
