import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/lib/news-server";

export function useNewsData(sport: string) {
	return useQuery({
		queryKey: ["news", sport],
		queryFn: () => getNews({ data: sport }),
	});
}
