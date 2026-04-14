import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
	useRouter,
	useRouterState,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import appCss from "../index.css?url";
import Layout from "../components/Layout";
import { type Admin, adminAuth } from "../lib/auth";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	},
});

/**
 * IMPORTANT: We render only React nodes that fit inside the #root div.
 * Rendering <html>/<body> here causes invalid DOM nesting and hydration
 * warnings like "html cannot be a child of div".
 */
export const Route = createRootRoute({
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
				title: "SportsDey Admin",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootLayout,
	errorComponent: ErrorBoundary,
});

function ErrorBoundary({ error }: { error: Error }) {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="text-center">
				<h1 className="mb-2 font-bold text-2xl text-gray-900">An error occurred</h1>
				<p className="mb-4 text-gray-600">{error?.message || "Something went wrong"}</p>
				<button
					onClick={() => router.navigate({ to: "/" })}
					className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent/90"
				>
					Go home
				</button>
			</div>
		</div>
	);
}

function RootLayout() {
	const { location } = useRouterState();
	const router = useRouter();
	const isAuthRoute = location.pathname === "/sign-in";
	const [admin, setAdmin] = useState<Admin | null>(null);
	const [checking, setChecking] = useState(!isAuthRoute);

	useEffect(() => {
		let isMounted = true;

		if (isAuthRoute) {
			setChecking(false);
			setAdmin(null);
			return;
		}

		setChecking(true);
		(async () => {
			try {
				const session = await adminAuth.getSession();
				if (!session) {
					router.navigate({ to: "/sign-in", replace: true });
					return;
				}
				if (isMounted) {
					setAdmin(session);
				}
			} catch (err) {
				router.navigate({ to: "/sign-in", replace: true });
			} finally {
				if (isMounted) {
					setChecking(false);
				}
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [isAuthRoute, router]);

	const handleLogout = async () => {
		await adminAuth.signOut();
		router.navigate({ to: "/sign-in", replace: true });
	};

	if (!isAuthRoute && checking) {
		return (
			<>
				<HeadContent />
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
				</div>
				<Scripts />
			</>
		);
	}

	if (!isAuthRoute && !admin) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<HeadContent />
			{isAuthRoute ? (
				<Outlet />
			) : (
				<Layout admin={admin} onLogout={handleLogout}>
					<Outlet />
				</Layout>
			)}
			<Scripts />
		</QueryClientProvider>
	);
}
