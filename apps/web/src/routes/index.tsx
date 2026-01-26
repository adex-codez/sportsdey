import { createFileRoute, redirect } from "@tanstack/react-router";

import { useActiveTab } from "@/components/active-tab-context";
import FootballSchedule from "@/components/football-schedule";
import RightSidebar from "@/components/RightSidebar";


import { getBanners } from "@/lib/banners-server";
import ImportantUpdate from "@/shared/ImportantUpdate";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		league: (search.league as string) || undefined,
		sports: (search.sports as string) || undefined,
	}),
	beforeLoad: ({ search }) => {
		if (!search.sports) {
			throw redirect({
				to: "/news",
				search: {
					tab: "news",
				},
			});
		}
	},

	loader: () => getBanners(),
	component: HomeComponent,
});

function HomeComponent() {
	const { tab } = useActiveTab();
	const banners = Route.useLoaderData() || [];

	return (
		<div className="h-full px-4 py-2 lg:container lg:mx-auto">
			<div className="h-full items-start gap-6 lg:grid lg:grid-cols-[3fr_1fr]">
				<div className="no-scrollbar h-full space-y-6 overflow-y-auto pb-20">
					{tab === "scores" ? <FootballSchedule banners={banners} /> : null}
					<ImportantUpdate />
				</div>


				<div className="no-scrollbar hidden h-full overflow-y-auto pb-20 lg:block">
					<RightSidebar />
				</div>
			</div>
		</div>
	);
}
