import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import Sidebar from "@/components/sidebar";
import Socials from "@/components/socials";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "../components/header";
import appCss from "../index.css?url";
import { Provider } from "react-redux";
import { store } from "@/store";

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
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<Provider store={store}>
			<html lang="en" className="dark">
				<head>
					<HeadContent />
					<link rel="stylesheet" href={appCss} />
				</head>
				<body suppressHydrationWarning>
					<QueryClientProvider client={queryClient}>
						<ErrorBoundary>
							<Providers>
								<div className="grid h-svh grid-rows-[auto_1fr_auto] lg:grid-rows-[auto_auto_1fr]">
									<Header />
									<Socials />
									<div className="mx-4 grid md:gap-8 lg:mx-[104px] lg:grid-cols-[20%_80%]">
										<div className="hidden lg:block">
											<Sidebar />
										</div>
										<Outlet />
									</div>
									<Footer />
								</div>
							</Providers>

							<Toaster richColors position="top-right" />
							<TanStackRouterDevtools position="bottom-right" />
							<ReactQueryDevtools initialIsOpen={false} />
							<Scripts />
						</ErrorBoundary>
					</QueryClientProvider>
				</body>
			</html>
		</Provider>
	);
}
