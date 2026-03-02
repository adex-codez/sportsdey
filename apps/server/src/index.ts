import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createAuth } from "./auth";
import routes from "./routes/route";
import type { CloudflareBindings } from "./types";

const app = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
	type: "http",
	scheme: "bearer",
	description:
		"Enter the session token from /auth/sign-in/email or /auth/sign-in/oauth",
});

app.use(logger());
app.use(
	"/*",
	cors({
		origin: (origin) => origin,
		allowMethods: ["GET", "POST", "OPTIONS"],
		credentials: true,
	}),
);

app.on(["GET", "POST"], "/auth/*", async (c) => {
	const auth = createAuth(c.env);
	return auth.handler(c.req.raw);
});

app.use("*", async (c, next) => {
	const auth = createAuth(c.env);
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});
	c.set("session", session);
	c.set("user", session?.user ?? null);

	const user = c.get("user");
	console.log(user);
	await next();
});

app.on(["GET", "POST"], "/auth/*", async (c) => {
	const auth = c.get("auth");
	return auth.handler(c.req.raw);
});

app.route("/", routes);

app.get("/docs", swaggerUI({ url: "/openapi.json" }));
app.doc("/openapi.json", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "SportsDey API",
		description: "API for the sportsdey website",
	},
});

export default app;
