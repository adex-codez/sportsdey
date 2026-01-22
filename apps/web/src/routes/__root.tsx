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
import { SPORTS } from "@/lib/constants";
import z from "zod";

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
				name: "description",
				content:
					"Get Live Football & Basketball Scores plus News, and Real-Time Results with Sportsdey! Everything Sports Dey here! Click now!",
			},
			{
				title: "sportsdey",
			},
		],
	}),
	validateSearch: z.object({
		sports: z
			.enum([SPORTS.FOOTBALL, SPORTS.TENNIS, SPORTS.BASKETBALL])
			.optional(),
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<Provider store={store}>
			<html lang="en" className="dark">
				<head>
					<script
						id="gtm-script"
						key="gtm-script"
						dangerouslySetInnerHTML={{
							__html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5JZSLR3K');
      `,
						}}
					/>
					<HeadContent />
					<link rel="icon" href="/Favicon.svg" type="image/svg+xml" />
					<link rel="stylesheet" href={appCss} />
				</head>
				<body suppressHydrationWarning>
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-5JZSLR3K"
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
							title="Google Tag Manager"
						/>
					</noscript>
					<QueryClientProvider client={queryClient}>
						<ErrorBoundary>
							<Providers>
								<div className="flex h-svh flex-col overflow-hidden">
									<header className="shrink-0">
										<Header />
										<Socials />
									</header>

									<main className="flex-1 overflow-hidden">
										<div className="mx-4 md:gap-8 lg:mx-[104px] grid h-full lg:grid-cols-[20%_80%] py-4">
											<aside className="hidden lg:block h-full overflow-y-auto no-scrollbar pr-4">
												<Sidebar />
											</aside>
											<section className="h-full overflow-y-auto no-scrollbar min-w-0">
												<Outlet />
											</section>
										</div>
									</main>

									<footer className="shrink-0 lg:hidden">
										<Footer />
									</footer>
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
