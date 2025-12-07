import { OpenAPIHono } from "@hono/zod-openapi";
import basketballRoute from "./basketball";
import footballRoute from "./football";
import tennisRoute from "./tennis";

import newsRoute from "./news";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);
routes.route("/tennis", tennisRoute);
routes.route("/news", newsRoute);

export default routes;
