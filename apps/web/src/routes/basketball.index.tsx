import { createFileRoute } from "@tanstack/react-router";
import BasketballPage from "@/components/BasketballPage";
import { getBanners } from "@/lib/banners-server";

export const Route = createFileRoute("/basketball/")({
	validateSearch: (search: Record<string, unknown>) => ({
		league: (search.league as string) || undefined,
	}),
	loader: () => getBanners(),
	component: RouteComponent,
});

function RouteComponent() {
	const banners = Route.useLoaderData() || [];
	return <BasketballPage banners={banners} />;
}
