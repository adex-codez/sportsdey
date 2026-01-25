import { createServerFn } from "@tanstack/react-start";
import { client, urlFor } from "./sanity";

export interface BannerData {
	_id: string;
	imageUrl: string;
	url: string;
	alt?: string;
}

export const getBanners = createServerFn({ method: "GET" }).handler(
	async () => {
		const query = `*[_type == "banner"] | order(_createdAt desc) {
			_id,
			image,
			url,
			alt
		}`;

		const response = await client.fetch(query);

		if (!response || !Array.isArray(response) || response.length === 0) {
			return [];
		}

		try {
			const banners: BannerData[] = response
				.filter(
					(item: unknown) =>
						item && typeof item === "object" && "image" in item,
				)
				.map((item: Record<string, unknown>) => ({
					_id: item._id as string,
					url: (item.url as string) || "",
					alt: item.alt as string | undefined,
					imageUrl: urlFor(item.image).width(1200).url(),
				}));

			return banners;
		} catch {
			return [];
		}
	},
);
