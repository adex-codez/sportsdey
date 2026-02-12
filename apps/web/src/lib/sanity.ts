import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
	projectId: "en1qcqbd",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: true,
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);
