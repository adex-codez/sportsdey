import type { CloudflareBindings } from "../worker-configuration";

declare module "hono" {
	interface ContextVariableMap {
		auth: ReturnType<typeof import("better-auth").betterAuth>;
		session: import("better-auth/types").Session | null;
		user: import("better-auth/types").User | null;
	}
}

export type { CloudflareBindings };
