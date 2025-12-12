import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/betting")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isIframeLoading, setIsIframeLoading] = useState(true);
	useEffect(() => {
		const timer = setTimeout(() => setIsIframeLoading(false), 5000);
		const handleMessage = (event: MessageEvent) => {
			if (event.origin !== "https://bet.sportsdey.com") return;

			if (event.data?.type === "SET_IFRAME_HEIGHT") {
				const iframe = document.getElementById("lobbyWidget");
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
		<div className="my-5">
			{isIframeLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}
			<iframe
				title="lobby widget"
				id="lobbyWidget"
				className={cn(
					"rounded-2xl transition-opacity duration-500",
					isIframeLoading ? "opacity-0" : "opacity-100",
				)}
				src="https://bet.sportsdey.com/?mode=iframe"
				style={{ width: "100%", border: "0", overflow: "hidden" }}
			/>
		</div>
	);
}
