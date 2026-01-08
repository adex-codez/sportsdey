import { useNewsVideos } from "@/hooks/use-news-videos";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VideoCard } from "./basketball-section/VideoCard";
import { VideoModal } from "./basketball-section/VideoModal";

export function VideosTab({ sport }: { sport: string }) {
	const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useNewsVideos(sport);

	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	if (isLoading) {
		return (
			<div className="flex h-96 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-96 items-center justify-center text-red-500">
				Failed to load news videos.
			</div>
		);
	}

	return (
		<div className="rounded-2xl bg-white">
			<div className="border-b border-gray-200 px-4 py-2">
				<h2 className="font-bold text-xl">Latest news</h2>
			</div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 py-4">
				{data?.pages.map((page, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={i} className="contents">
						{page.videos.map((video) => (
							<VideoCard
								key={video.videoId}
								videoId={video.videoId}
								title={video.title}
								publishedAt={video.publishedAt}
								onPlay={setSelectedVideoId}
							/>
						))}
						<VideoModal
							videoId={selectedVideoId}
							onClose={() => setSelectedVideoId(null)}
						/>
					</div>
				))}
			</div>

			<div ref={observerTarget} className="mt-8 flex justify-center py-4">
				{isFetchingNextPage && (
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				)}
			</div>
		</div>
	);
}
