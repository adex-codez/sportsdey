import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function BettingWidget() {
	const [isIframeLoading, setIsIframeLoading] = useState(true);
	const [theme, setTheme] = useState("sportsdeyLite");

	useEffect(() => {
		// Detect initial theme
		const isDarkMode = document.documentElement.classList.contains("dark");
		setTheme(isDarkMode ? "sportsdeyDark" : "sportsdeyLite");

		// Watch for theme changes
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains("dark");
			setTheme(isDark ? "sportsdeyDark" : "sportsdeyLite");
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => setIsIframeLoading(false), 5000);
		const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://bet.sportsdey.com") return;

            if (event.data?.type === "SET_LOBBY_SIDEBAR_WIDGET_HEIGHT") {
                const iframe = document.getElementById(
                    "lobbySidebarWidget"
                ) as HTMLIFrameElement | null;

                if (iframe && event.data.height) {
                    iframe.style.height = `${event.data.height}px`;
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
				id="lobbySidebarWidget"
				src={`https://bet.sportsdey.com/?view=sidebar&theme=${theme}&ticketOpenMode=redirect`}
				title="sportsdey betting widget"
				className={cn(
					"rounded-2xl transition-opacity duration-500 bg-red-200",
					isIframeLoading ? "opacity-0" : "opacity-100",
				)}
				style={{
                    width: "100%",
                    minHeight: "200px",
                    border: "0",
                    overflow: "hidden",
                }}
			/>
		</>
	);
}
