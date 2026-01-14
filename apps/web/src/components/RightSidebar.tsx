import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Loader2, Play } from "lucide-react";
import { useNewsData } from "@/hooks/use-news-data";
import { useNewsVideos } from "@/hooks/use-news-videos";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { urlFor } from "@/lib/sanity";
import { formatRelativeTime } from "@/lib/utils";
import { VideoModal } from "@/components/basketball-section/VideoModal";
import { useState } from "react";

const RightSidebar = () => {
    const sport = useCurrentSport() || "football";
    const { data: newsData, isLoading: isNewsLoading } = useNewsData(sport);
    const { data: videoData, isLoading: isVideoLoading } = useNewsVideos(sport);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Show only the first news item if available
    const latestNews = newsData && newsData.length > 0 ? newsData[0] : null;

    // Show up to 2 videos if available
    const activeVideos = videoData?.pages[0]?.videos?.slice(0, 2) || [];



    const handleShowMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate({ to: "/news", search: { sports: sport } });
    };

    if (isNewsLoading && isVideoLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
            </div>
        );
    }

    // If no news and no videos, return null (hide sidebar content)
    if (!latestNews && activeVideos.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6 pb-24">
            {/* News Widget - Only show if news exists */}
            {latestNews && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-primary">News</h3>
                        <Link
                            to="/news"
                            search={{ sports: sport }}
                            className="text-xs font-semibold text-gray-400 hover:text-accent flex items-center gap-1"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="p-4" onClick={() => navigate({ to: `/news/$newsId`, params: { newsId: latestNews._id } })}>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 cursor-pointer group">
                            <img
                                src={urlFor(latestNews.image).url()}
                                alt={latestNews.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <h4
                            onClick={() => navigate({ to: `/news/$newsId`, params: { newsId: latestNews._id } })}
                            className="font-bold text-sm text-primary mb-2 line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                        >
                            {latestNews.title}
                        </h4>
                        <p className="text-xs text-gray-400 mb-4">
                            {formatRelativeTime(latestNews.publishedAt)}
                        </p>

                        <button
                            onClick={() => navigate({ to: "/news", search: { sports: sport } })}
                            className="w-full py-2.5 text-xs text-end font-bold underline text-accent transition-colors mt-2"
                        >
                            View more
                        </button>
                    </div>
                </div>
            )}

            {/* Videos Widget - Only show if videos exist */}
            {activeVideos.length > 0 && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-primary">Videos</h3>
                        <Link
                            to="/news"
                            search={{ sports: sport }}
                            className="text-xs font-semibold text-gray-400 hover:text-accent flex items-center gap-1"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-4">
                        {activeVideos.map((video) => (
                            <div key={video.videoId} className="group cursor-pointer">
                                <div
                                    className="relative aspect-video w-full rounded-xl overflow-hidden mb-2 bg-black/5"
                                    onClick={() => setSelectedVideoId(video.videoId)}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                                <h5
                                    className="font-medium text-sm text-primary line-clamp-2 group-hover:text-accent transition-colors"
                                    onClick={() => setSelectedVideoId(video.videoId)}
                                >
                                    {video.title}
                                </h5>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {formatRelativeTime(video.publishedAt)}
                                </p>
                            </div>
                        ))}

                        <button
                            onClick={() => navigate({ to: "/news", search: { sports: sport } })}
                            className="w-full py-2.5 text-xs text-end font-bold underline text-accent transition-colors mt-2"
                        >
                            View more
                        </button>
                    </div>
                </div>
            )}

            <VideoModal
                videoId={selectedVideoId}
                onClose={() => setSelectedVideoId(null)}
            />
        </div>
    );
};

export default RightSidebar;
