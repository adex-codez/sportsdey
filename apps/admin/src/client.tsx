import { RouterProvider } from "@tanstack/react-router";
import { createRoot, hydrateRoot } from "react-dom/client";
import { getRouter } from "./router";

const router = getRouter();
const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root container #root not found");
}

/**
 * When the app is server-rendered (Cloudflare Workers via Wrangler),
 * the server inserts HTML into #root. In that case we must hydrate
 * instead of skipping rendering, otherwise no React event handlers
 * are ever attached and the UI feels "frozen" (e.g., inputs won't
 * accept typing, buttons don't respond).
 *
 * For purely client-side rendering (empty #root) we fall back to
 * the usual createRoot path.
 */
if (rootElement.hasChildNodes()) {
	hydrateRoot(rootElement, <RouterProvider router={router} />);
} else {
	createRoot(rootElement).render(<RouterProvider router={router} />);
}
