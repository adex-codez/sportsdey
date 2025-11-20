import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ActiveTabProvider } from "@/components/active-tab-context";
import Sidebar from "@/components/sidebar";
import Socials from "@/components/socials";
import { Toaster } from "@/components/ui/sonner";
import Header from "../components/header";
import appCss from "../index.css?url";

export type RouterAppContext = {};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 10 * 1000,
			gcTime: 5 * 10 * 1000,
		},
	},
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "sportsdey",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<ActiveTabProvider>
						<div className="grid h-svh grid-rows-[auto_auto_1fr]">
							<Header />
							<Socials />
							<div className="mx-4 grid md:gap-8 lg:mx-[104px] lg:grid-cols-[20%_80%]">
								<div className="hidden lg:block">
									<Sidebar />
								</div>
								<Outlet />
							</div>
						</div>
					</ActiveTabProvider>

					<Toaster richColors />
					<TanStackRouterDevtools position="bottom-right" />
					<ReactQueryDevtools initialIsOpen={false} />
					<Scripts />
				</QueryClientProvider>
			</body>
		</html>
	);
}
