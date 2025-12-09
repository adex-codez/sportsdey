import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SPORTS } from "@/lib/constants";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VideosTab } from "@/components/news-videos";

export const Route = createFileRoute("/news")({
	validateSearch: z.object({
		sports: z
			.enum([SPORTS.FOOTBALL, SPORTS.TENNIS, SPORTS.BASKETBALL])
			.optional(),
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const sport = useCurrentSport();
	const [activeTab, setActiveTab] = useState<"news" | "socials" | "videos">(
		"news",
	);

	const tabs = [
		{ id: "news", label: "News" },
		{ id: "socials", label: "Socials" },
		{ id: "videos", label: "Videos" },
	] as const;

	return (
		<div className="">
			<div className="mb-6 flex flex-wrap gap-4 py-4">
				{tabs.map((tab) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
			{activeTab === "news" && (
				<div className="flex h-64 items-center justify-center rounded-xl border bg-white p-8 text-center text-muted-foreground">
					<p>News articles coming soon...</p>
				</div>
			)}
			{activeTab === "socials" && (
				<div className="flex h-64 items-center justify-center rounded-xl border bg-white p-8 text-center text-muted-foreground">
					<p>Social media feed coming soon...</p>
				</div>
			)}
		</div>
	);
}


