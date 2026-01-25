import { useQuery } from "@tanstack/react-query";
import type { BetstackApiResponse, BetstackSuperbet } from "@/types/football";

const BETSTACK_API_URL = "https://api.betstack.io/bc/superbets";

export function useFootballBetting(
	homeTeamName: string,
	homeTeamShortName: string,
	awayTeamName: string,
	awayTeamShortName: string,
	enabled = true,
) {
	return useQuery({
		queryKey: ["football-betting", homeTeamName, awayTeamName],
		enabled: enabled && Boolean(homeTeamName) && Boolean(awayTeamName),
		queryFn: async (): Promise<BetstackSuperbet | null> => {
			const url = `${BETSTACK_API_URL}?operator=hallabet-ng`;

			const response = await fetch(url);

			if (!response.ok) {
				return null;
			}

			const data = (await response.json()) as BetstackApiResponse;

			const match = data.find((superbet) => {
				const superbetHome = superbet.event.home_team.name;
				const superbetAway = superbet.event.away_team.name;

				const isHomeMatch =
					superbetHome === homeTeamName || superbetHome === homeTeamShortName;

				const isAwayMatch =
					superbetAway === awayTeamName || superbetAway === awayTeamShortName;

				return isHomeMatch && isAwayMatch;
			});

			return match || null;
		},
		refetchInterval: 10 * 1000,
		retry: true,
	});
}
