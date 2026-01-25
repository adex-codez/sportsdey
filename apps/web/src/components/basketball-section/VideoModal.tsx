import { X } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
	videoId: string | null;
	onClose: () => void;
}

export function VideoModal({ videoId, onClose }: VideoModalProps) {
	useEffect(() => {
		if (videoId) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [videoId]);

	if (!videoId) return null;

	return (
		<div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-sm duration-200">
			<div
				className="absolute inset-0"
				onClick={onClose}
				aria-label="Close modal backdrop"
			/>
			<div className="relative z-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-20 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
					aria-label="Close video"
				>
					<X className="h-5 w-5" />
				</button>
				<iframe
					src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
					title="YouTube video player"
					className="h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			</div>
		</div>
	);
}
