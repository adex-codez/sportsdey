import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import basketballRoute from "./basketball";
import footballRoute from "./football";
import tennisRoute from "./tennis";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);
routes.route("/tennis", tennisRoute);

export default routes;
