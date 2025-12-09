import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function BettingWidget() {
	const [isIframeLoading, setIsIframeLoading] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => setIsIframeLoading(false), 5000);
		const handleMessage = (event: MessageEvent) => {
			console.log(event.origin);
			if (event.origin !== "https://bet.sportsdey.com") return;

			if (event.data?.type === "SET_IFRAME_HEIGHT") {
				const iframe = document.getElementById("betting-widget");
				if (iframe) {
					iframe.style.height = event.data.height + "px";
				}
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
			clearTimeout(timer);
		};
	}, []);

	return (
		<>
			{isIframeLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}
			<iframe
				id="betting-widget"
				title="sportsdey betting widget"
				src="https://bet.sportsdey.com/?mode=widget"
				className={cn(
					"rounded-2xl transition-opacity duration-500",
					isIframeLoading ? "opacity-0" : "opacity-100",
				)}
				style={{ width: "100%", border: "0", overflow: "hidden" }}
			/>
		</>
	);
}
