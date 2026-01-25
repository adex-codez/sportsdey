import { createFileRoute } from "@tanstack/react-router";
import BannerCarousel from "@/components/BannerCarousel";
import TennisDetailsPage from "@/components/tennis-section/TennisDetailsPage";
import { getBanners } from "@/lib/banners-server";

export const Route = createFileRoute("/tennis/$Id")({
	loader: () => getBanners(),
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			country: (search.country as string) || undefined,
		};
	},
});

function RouteComponent() {
	const banners = Route.useLoaderData() || [];

	return (
		<div>
			{banners.length > 0 && (
				<div className="px-4 lg:container lg:mx-auto">
					<div className="w-full overflow-hidden rounded-xl">
						<BannerCarousel banners={banners} />
					</div>
				</div>
			)}
			<TennisDetailsPage />
		</div>
	);
}
