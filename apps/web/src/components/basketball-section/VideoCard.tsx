import { Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
    videoId: string;
    title: string;
    publishedAt: string;
    onPlay: (videoId: string) => void;
}

export function VideoCard({ videoId, title, publishedAt, onPlay }: VideoCardProps) {
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

    return (
        <div
            onClick={() => onPlay(videoId)}
            className="group block space-y-3 cursor-pointer"
        >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900">
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-red-600 transition-transform duration-300 group-hover:scale-110 shadow-lg">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-primary line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{timeAgo}</p>
            </div>
        </div>
    );
}
