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
		origin: (origin, c) => {
			console.log("CORS_ORIGIN", c.env.CORS_ORIGIN);
			if (!origin) return "";
			const allowedOrigins = new Set([
				c.env.CORS_ORIGIN,
				"http://localhost:3001",
				"http://localhost:8787",
			]);
			return allowedOrigins.has(origin) ? origin : "";
		},
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Authorization", "Content-Type"],
		credentials: true,
	}),
);

app.on(["GET", "POST"], "/auth/*", async (c) => {
	const auth = createAuth(c.env);
	return auth.handler(c.req.raw);
});

app.use("*", async (c, next) => {
	const path = c.req.path;
	if (
		path.startsWith("/auth/") ||
		path.startsWith("/docs") ||
		path.startsWith("/openapi")
	) {
		return next();
	}
	const auth = createAuth(c.env);
	const sessionResult = await auth.api.getSession({
		headers: c.req.raw.headers,
	});
	const session = sessionResult?.session ?? null;
	const user = sessionResult?.user ?? null;
	c.set("session", session);
	c.set("user", user);

	await next();
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
