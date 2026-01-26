import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { type Sport } from "@/lib/constants";

import BannerCarousel from "@/components/BannerCarousel";
import { NewsPage } from "@/components/news-page";
import { VideosTab } from "@/components/news-videos";
import { getBanners } from "@/lib/banners-server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/news/")({
	loader: () => getBanners(),
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			tab: (search.tab as "news" | "videos") || "news",
			sports: search.sports as Sport,
		};
	},
	component: RouteComponent,
});


type SportFilter =
	| "all"
	| "football"
	| "basketball"
	| "racing"
	| "tennis"
	| "boxing"
	| "mma/ufc";

type SearchParams = {
	tab?: "news" | "videos";
	sports?: Sport;
};


function RouteComponent() {
	const search = useSearch({ from: "/news" }) as SearchParams;
	const router = useRouter();
	const activeTab = search.tab === "videos" ? "videos" : "news";
	const [sportFilter, setSportFilter] = useState<SportFilter>("all");
	const banners = Route.useLoaderData() || [];

	const tabs = [
		{ id: "news", label: "News" },
		{ id: "videos", label: "Videos" },
	] as const;

	const sportFilters = [
		{ id: "all", label: "All" },
		{ id: "football", label: "Football" },
		{ id: "basketball", label: "Basketball" },
		{ id: "racing", label: "Racing" },
		{ id: "tennis", label: "Tennis" },
		{ id: "boxing", label: "Boxing" },
		{ id: "mma/ufc", label: "MMA/UFC" },
	] as const;

	return (
		<div className="">
			<div className="hidden mb-6 lg:flex flex-wrap gap-4 py-4">
				{tabs.map((tab) => (
					<div
						key={tab.id}
						onClick={() =>
							router.navigate({
								to: "/news",
								search: { tab: tab.id, sports: search.sports },
							})
						}
						className={cn(
							"flex h-12 w-max cursor-pointer items-center gap-2 rounded-2xl bg-white px-6 font-medium text-sm transition-colors",
							activeTab === tab.id
								? "bg-accent text-white"
								: "text-gray-500 hover:bg-gray-50",
						)}
					>
						{tab.label}
					</div>
				))}
			</div>

			<div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto py-4">
				{sportFilters.map((filter) => (
					<div
						key={filter.id}
						onClick={() => setSportFilter(filter.id)}
						className={cn(
							"flex h-10 w-max cursor-pointer items-center gap-2 rounded-xl bg-white px-4 font-medium text-sm transition-colors",
							sportFilter === filter.id
								? "bg-accent text-white"
								: "text-gray-500 hover:bg-gray-50",
						)}
					>
						{filter.label}
					</div>
				))}
			</div>

			{banners.length > 0 && (
				<div className="mb-6 px-4 lg:container lg:mx-auto">
					<div className="w-full overflow-hidden rounded-xl">
						<BannerCarousel banners={banners} />
					</div>
				</div>
			)}

			{activeTab === "videos" && <VideosTab sport={sportFilter} />}
			{activeTab === "news" && <NewsPage sport={sportFilter} />}
		</div>
	);
}
