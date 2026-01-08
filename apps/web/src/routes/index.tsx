import { createFileRoute } from "@tanstack/react-router";
import { useActiveTab } from "@/components/active-tab-context";
import FootballSchedule from "@/components/football-schedule";
import ImportantUpdate from "@/shared/ImportantUpdate";

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
		<div className="px-4 py-2 lg:container lg:mx-auto space-y-6">
			{tab === "scores" ? <FootballSchedule /> : null}
			<ImportantUpdate />
		</div>
	);
}
