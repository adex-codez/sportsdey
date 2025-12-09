import BettingWidget from "@/components/betting-widget";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/betting")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mt-10">
			<BettingWidget />
		</div>
	);
}
