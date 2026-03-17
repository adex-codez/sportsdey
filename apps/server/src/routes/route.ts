import { OpenAPIHono } from "@hono/zod-openapi";
import basketballRoute from "./basketball";
import casinoRoute from "./casino";
import casinoProviderRoute from "./casino-provider";
import footballRoute from "./football";
import newsRoute from "./news";
import notificationsRoute from "./notifications";
import palmpayRoute from "./palmpay";
import tennisRoute from "./tennis";
import userRoute from "./user";
import utilityRoute from "./utility";
import walletRoute from "./wallet";

const routes = new OpenAPIHono();

routes.route("/football", footballRoute);
routes.route("/basketball", basketballRoute);
routes.route("/tennis", tennisRoute);
routes.route("/news", newsRoute);
routes.route("/notifications", notificationsRoute);
routes.route("/wallet", walletRoute);
routes.route("/user", userRoute);
routes.route("/casino", casinoRoute);
routes.route("/account", casinoProviderRoute);
routes.route("/palmpay", palmpayRoute);
routes.route("/utility", utilityRoute);

export default routes;
