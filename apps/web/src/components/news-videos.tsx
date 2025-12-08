import { useNewsVideos } from "@/hooks/use-news-videos";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { format } from "date-fns";

export function VideosTab({ sport }: { sport: string }) {
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
							<div
								key={video.videoEmbedUrl}
								className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow"
							>
								<div className="aspect-video w-full">
									<iframe
										src={video.videoEmbedUrl}
										title={video.title}
										className="h-full w-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
								<div className="p-4">
									<h3 className="line-clamp-2 font-semibold text-lg leading-tight">
										{video.title}
									</h3>
									<p className="mt-2 text-muted-foreground text-sm">
										{format(new Date(video.publishedAt), "PPP")}
									</p>
								</div>
							</div>
						))}
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