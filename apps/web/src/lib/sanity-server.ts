import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const token = process.env.SANITY_WRITE_TOKEN;

export const serverClient = createClient({
	projectId: "en1qcqbd",
	dataset: "production",
	apiVersion: "2024-01-01",
	useCdn: false,
	token,
});

const serverBuilder = createImageUrlBuilder(serverClient);

export const urlForServer = (source: any) => serverBuilder.image(source);
