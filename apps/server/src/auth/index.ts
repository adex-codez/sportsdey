import * as schema from "@sportsdey/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import type { CloudflareBindings } from "../bindings";

export const createAuth = (env: CloudflareBindings) => {
	const db = drizzle(env.DB, { schema });

	return betterAuth({
		database: drizzleAdapter(db, { provider: "sqlite" }),
		emailAndPassword: { enabled: true },
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
			apple: {
				clientId: env.APPLE_CLIENT_ID,
				clientSecret: env.APPLE_CLIENT_SECRET,
			},
		},
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins:
			env.NODE_ENV === "development"
				? ["http://localhost:8787", "http://localhost:3001"]
				: [env.BETTER_AUTH_URL],
		advanced: {
			crossSubDomainCookies: {
				enabled: env.NODE_ENV !== "development",
			},
		},
	});
};
