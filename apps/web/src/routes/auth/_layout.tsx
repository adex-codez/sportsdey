import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createFileRoute("/auth/_layout")({
	component: () => (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
			<div className="flex min-h-screen flex-col">
				<main className="flex-1">
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	),
});
