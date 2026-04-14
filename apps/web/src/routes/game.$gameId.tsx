import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/game/$gameId")({
	component: GamePage,
});

function GamePage() {
	const { gameId } = Route.useParams();
	const location = useLocation();
	const gameUrl = location.state?.gameUrl as string | undefined;

	if (!gameUrl) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-gray-500">Loading game...</p>
			</div>
		);
	}

	return (
		<iframe
			src={gameUrl}
			className="h-screen w-full border-0"
			title={gameId}
			allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		/>
	);
}
