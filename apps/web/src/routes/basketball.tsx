import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/basketball")({
	component: () => <Outlet />,
});
