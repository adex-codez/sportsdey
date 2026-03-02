import { OpenAPIHono } from "@hono/zod-openapi";
import basketballRoute from "./basketball";
import footballRoute from "./football";
import newsRoute from "./news";
import notificationsRoute from "./notifications";
import tennisRoute from "./tennis";
import walletRoute from "./wallet";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);
routes.route("/tennis", tennisRoute);
routes.route("/news", newsRoute);
routes.route("/notifications", notificationsRoute);
routes.route("/wallet", walletRoute)

export default routes;
