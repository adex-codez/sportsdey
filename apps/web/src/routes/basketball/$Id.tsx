import { createFileRoute } from "@tanstack/react-router";
import BasketBallDetailsPage from "@/components/basketball-section/BasketBallDetailsPage";

export const Route = createFileRoute("/basketball/$Id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<BasketBallDetailsPage />
		</div>
	);
}
