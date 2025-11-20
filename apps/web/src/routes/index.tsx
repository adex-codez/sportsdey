import { createFileRoute } from "@tanstack/react-router";
import { useActiveTab } from "@/components/active-tab-context";
import FootballSchedule from "@/components/football-schedule";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const { tab } = useActiveTab();
	return (
		<div className="container mx-auto px-4 py-2">
			{tab === "scores" ? <FootballSchedule /> : null}
		</div>
	);
}
