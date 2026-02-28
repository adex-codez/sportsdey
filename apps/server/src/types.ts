import type { Session, User } from "better-auth/types";
import type { CloudflareBindings } from "../../worker-configuration";

declare module "hono" {
	interface ContextVariableMap {
		session: Session | null;
		user: User | null;
	}
}

export type { CloudflareBindings };
