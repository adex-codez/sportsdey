import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";

interface VideoCardProps {
	videoId: string;
	title: string;
	publishedAt: string;
	onPlay: (videoId: string) => void;
}

export function VideoCard({
	videoId,
	title,
	publishedAt,
	onPlay,
}: VideoCardProps) {
	const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

	const timeAgo = formatDistanceToNow(new Date(publishedAt), {
		addSuffix: true,
	});

	return (
		<div
			onClick={() => onPlay(videoId)}
			className="group block cursor-pointer space-y-3"
		>
			<div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
				<img
					src={thumbnailUrl}
					alt={title}
					className="h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
						<Play className="ml-1 h-6 w-6 fill-white text-white" />
					</div>
				</div>
			</div>
			<div>
				<h3 className="line-clamp-2 font-semibold text-primary text-sm leading-tight transition-colors group-hover:text-blue-600 dark:text-white">
					{title}
				</h3>
				<p className="mt-1 text-muted-foreground text-xs">{timeAgo}</p>
			</div>
		</div>
	);
}
