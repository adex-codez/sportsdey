import { OpenAPIHono } from "@hono/zod-openapi";
import basketballRoute from "./basketball";
import casinoRoute from "./casino";
import casinoProviderRoute from "./casino-provider";
import footballRoute from "./football";
import monnifyRoute from "./monnify";
import newsRoute from "./news";
import notificationsRoute from "./notifications";
import tennisRoute from "./tennis";
import thundrRoute from "./thundr";
import userRoute from "./user";
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
routes.route("/thndr", thundrRoute);
routes.route("/account", casinoProviderRoute);
routes.route("/bills", monnifyRoute);

export default routes;
