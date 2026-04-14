import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div className="rounded-2xl bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-bold text-gray-900">Overview</h1>
			<p className="mt-2 text-gray-600">
				Select an option from the sidebar to get started.
			</p>
		</div>
	);
}
