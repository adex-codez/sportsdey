import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { type BasketballVideosData } from "@/types/api";
import { VideoCard } from "./VideoCard";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { VideoModal } from "./VideoModal";

interface VideosTabProps {
    homeTeam: string;
    awayTeam: string;
}

export function VideosTab({ homeTeam, awayTeam }: VideosTabProps) {
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const searchQuery = `${homeTeam} Vs ${awayTeam}`;

    const { data: videosData, isLoading } = useQuery({
        queryKey: ['basketball', 'videos', searchQuery],
        queryFn: () => apiRequest<BasketballVideosData>(`/api/basketball/videos?query=${encodeURIComponent(searchQuery)}`),
        enabled: !!homeTeam && !!awayTeam,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    const videos = videosData?.videos || [];

    if (videos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No highlights found for this match.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Game Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                {videos.map((video) => (
                    <VideoCard
                        key={video.videoId}
                        videoId={video.videoId}
                        title={video.title}
                        publishedAt={video.publishedAt}
                        onPlay={setSelectedVideoId}
                    />
                ))}
            </div>

            <VideoModal
                videoId={selectedVideoId}
                onClose={() => setSelectedVideoId(null)}
            />
        </div>
    );
}
