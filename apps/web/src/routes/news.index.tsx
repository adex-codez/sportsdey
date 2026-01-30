import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { type Sport } from "@/lib/constants";

import BannerCarousel from "@/components/BannerCarousel";
import { NewsPage } from "@/components/news-page";
import { VideosTab } from "@/components/news-videos";
import { getBanners } from "@/lib/banners-server";
import { cn } from "@/lib/utils";

type CategoryFilter =
	| "all"
	| "football"
	| "basketball"
	| "racing"
	| "tennis"
	| "boxing"
	| "mma/ufc"
	| "politics"
	| "entertainment";

export const Route = createFileRoute("/news/")({
	loader: () => getBanners(),
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			tab: (search.tab as "news" | "videos") || "news",
			category: search.sports as CategoryFilter,
		};
	},
	component: RouteComponent,
});




type SearchParams = {
	tab?: "news" | "videos";
	category?: CategoryFilter;
};


function RouteComponent() {
	const search = useSearch({ from: "/news" }) as SearchParams;
	const router = useRouter();
	const activeTab = search.tab === "videos" ? "videos" : "news";
	const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
	const banners = Route.useLoaderData() || [];

	const tabs = [
		{ id: "news", label: "News" },
		{ id: "videos", label: "Videos" },
	] as const;

	const categoryFilters = [
		{ id: "all", label: "All" },
		{ id: "football", label: "Football" },
		{ id: "basketball", label: "Basketball" },
		{ id: "racing", label: "Racing" },
		{ id: "tennis", label: "Tennis" },
		{ id: "boxing", label: "Boxing" },
		{ id: "mma/ufc", label: "MMA/UFC" },
		{ id: "politics", label: "Politics" },
		{ id: "entertainment", label: "Entertainment" }
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
								search: { tab: tab.id, category: search.category },
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
				{categoryFilters.map((filter) => (
					<div
						key={filter.id}
						onClick={() => setCategoryFilter(filter.id)}
						className={cn(
							"flex h-10 w-max cursor-pointer items-center gap-2 rounded-xl bg-white px-4 font-medium text-sm transition-colors",
							categoryFilter === filter.id
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

			{activeTab === "videos" && <VideosTab category={categoryFilter} />}
			{activeTab === "news" && <NewsPage category={categoryFilter} />}
		</div>
	);
}
