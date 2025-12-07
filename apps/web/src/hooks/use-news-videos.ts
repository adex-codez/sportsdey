import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { NewsResponse } from "@/types/news";

export function useNewsVideos(query: string) {
	return useInfiniteQuery({
		queryKey: ["news-videos", query],
		queryFn: ({ pageParam }) => {
			const endpoint = `news/videos?query=${encodeURIComponent(`${query} match highlights, live matches, news`)}${
				pageParam ? `&pageToken=${pageParam}` : ""
			}`;
			return apiRequest<NewsResponse>(endpoint);
		},
		initialPageParam: "",
		getNextPageParam: (lastPage) => lastPage.nextPageToken,
	});
}
