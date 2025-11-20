import { env } from "cloudflare:workers";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import routes from "./routes/route";

const app = new OpenAPIHono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
	}),
);

app.route("/api", routes);

app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));
app.doc("/api/openapi.json", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "SportsDey API",
		description: "API for the sportsdey website",
	},
});

export default app;
