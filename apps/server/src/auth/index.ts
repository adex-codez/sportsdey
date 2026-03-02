import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, openAPI } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import type { CloudflareBindings } from "../../worker-configuration";

export const createAuth = (env: CloudflareBindings) => {
	const db = drizzle(env.DB, { schema });

	return betterAuth({
		basePath: "/auth",
		database: drizzleAdapter(db, { provider: "sqlite" }),
		emailAndPassword: { enabled: true },
		plugins: [expo(), openAPI(), bearer()],
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
			apple: {
				clientId: env.APPLE_CLIENT_ID,
				clientSecret: env.APPLE_CLIENT_SECRET,
			},
			facebook: {
				clientId: env.FACEBOOK_CLIENT_ID,
				clientSecret: env.FACEBOOK_CLIENT_SECRET,
			},
		},
		user: {
			deleteUser: {
				enabled: true,
			},
		},
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		trustedOrigins:
			env.NODE_ENV === "development"
				? [
						"http://localhost:8787",
						"http://localhost:3001",
						"sportsdey-mobile://",
						"exp://172.20.10.9:8081",
					]
				: ["sportsdey.com", "exp://172.20.10.9:8081", "sportsdey-mobile://"],
		advanced: {
			crossSubDomainCookies: {
				enabled: env.NODE_ENV !== "development",
			},
		},
	});
};
