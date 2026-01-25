import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BetWidgetProps {
	code: string;
}

export function BetWidget({ code }: BetWidgetProps) {
	const [isIframeLoading, setIsIframeLoading] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => setIsIframeLoading(false), 5000);
		// const handleMessage = (event: MessageEvent) => {
		// 	// console.log("event origin",event.origin);
		// 	if (event.origin !== "https://bet.sportsdey.com") return;

		// 	if (event.data?.type === "SET_IFRAME_HEIGHT") {
		// 		const iframe = document.getElementById("betting-widget");
		// 		if (iframe) {
		// 			iframe.style.height = event.data.height + "px";
		// 		}
		// 	}
		// };

		// window.addEventListener("message", handleMessage);

		return () => {
			// window.removeEventListener("message", handleMessage);
			clearTimeout(timer);
		};
	}, []);
	if (!code) {
		return null;
	}

	const iframeUrl = `https://bet.sportsdey.com/superbet/${code}`;

	return (
		<div className="relative h-[600px] w-full overflow-hidden rounded-xl bg-white">
			{isIframeLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}
			<iframe
				id="betting-widget"
				src={iframeUrl}
				className={cn(
					"cust-scrollbar h-full w-full rounded-2xl transition-opacity duration-500",
					isIframeLoading ? "opacity-0" : "opacity-100",
				)}
				title="Betting Widget"
				loading="lazy"
			/>
		</div>
	);
}
