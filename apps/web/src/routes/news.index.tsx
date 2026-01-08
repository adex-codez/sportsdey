import { createFileRoute } from "@tanstack/react-router";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VideosTab } from "@/components/news-videos";
import { NewsPage } from "@/components/news-page";

export const Route = createFileRoute("/news/")({
	component: RouteComponent,
});

function RouteComponent() {
	const sport = useCurrentSport();
	const [activeTab, setActiveTab] = useState<"news" | "videos">("news");

	const tabs = [
		{ id: "news", label: "News" },
		{ id: "videos", label: "Videos" },
	] as const;

	return (
		<div className="">
			<div className="mb-6 flex flex-wrap gap-4 py-4">
				{tabs.map((tab) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: onClick is handled
					// biome-ignore lint/a11y/noStaticElementInteractions: div acts as a tab
					<div
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={cn(
							"flex h-12 w-max cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium transition-colors",
							activeTab === tab.id
								? "bg-accent text-white"
								: "text-gray-500 hover:bg-gray-50",
						)}
					>
						{tab.label}
					</div>
				))}
			</div>

			{activeTab === "videos" && <VideosTab sport={sport} />}
			{activeTab === "news" && <NewsPage sport={sport} />}
		</div>
	);
}
