import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import basketballRoute from "./basketball";
import footballRoute from "./football";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);

export default routes;
