import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: ".wrangler/state/v3/d1/d091e50e-e19f-40dc-ad77-e7050c7bbbad.sqlite",
	},
});
