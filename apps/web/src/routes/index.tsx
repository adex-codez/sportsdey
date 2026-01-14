import { createFileRoute } from "@tanstack/react-router";
import { useActiveTab } from "@/components/active-tab-context";
import FootballSchedule from "@/components/football-schedule";
import ImportantUpdate from "@/shared/ImportantUpdate";
import RightSidebar from "@/components/RightSidebar";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => ({
		league: (search.league as string) || undefined,
		sports: (search.sports as string) || undefined,
	}),
	component: HomeComponent,
});

function HomeComponent() {
	const { tab } = useActiveTab();
	return (
		<div className="px-4 py-2 lg:container lg:mx-auto h-full">
			<div className="lg:grid lg:grid-cols-[3fr_1fr] gap-6 h-full items-start">
				<div className="space-y-6 h-full overflow-y-auto no-scrollbar pb-20">
					{tab === "scores" ? <FootballSchedule /> : null}
					<ImportantUpdate />
				</div>
				<div className="hidden lg:block h-full overflow-y-auto no-scrollbar pb-20">
					<RightSidebar />
				</div>
			</div>
		</div>
	);
}
