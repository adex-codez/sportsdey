import { X } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
    videoId: string | null;
    onClose: () => void;
}

export function VideoModal({ videoId, onClose }: VideoModalProps) {
    useEffect(() => {
        if (videoId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [videoId]);

    if (!videoId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-label="Close modal backdrop"
            />
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                    aria-label="Close video"
                >
                    <X className="w-5 h-5" />
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
