import { OpenAPIHono } from "@hono/zod-openapi";
import basketballRoute from "./basketball";
import footballRoute from "./football";
import newsRoute from "./news";
import tennisRoute from "./tennis";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);
routes.route("/tennis", tennisRoute);
routes.route("/news", newsRoute);

export default routes;
