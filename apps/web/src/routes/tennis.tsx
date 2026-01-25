import { createFileRoute, Outlet } from "@tanstack/react-router";
import BannerCarousel from "@/components/BannerCarousel";
import { getBanners } from "@/lib/banners-server";
import ImportantUpdate from "@/shared/ImportantUpdate";

export const Route = createFileRoute("/tennis")({
	loader: () => getBanners(),
	component: () => <TennisLayout />,
});

function TennisLayout() {
	const banners = Route.useLoaderData() || [];

	return (
		<div className="w-full space-y-4 pb-28">
			{banners.length > 0 && (
				<div className="px-4 lg:container lg:mx-auto">
					<div className="w-full overflow-hidden rounded-xl">
						<BannerCarousel banners={banners} />
					</div>
				</div>
			)}
			<Outlet />
			<ImportantUpdate />
		</div>
	);
}
