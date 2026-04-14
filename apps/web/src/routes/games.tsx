import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/games")({
	component: GamesPage,
});

const GAMES = [
	{
		code: "XCAPEHB",
		name: "Xcape",
		subtitle: "fulfilling games",
		image: "/xcape-thumbnail-16x9.jpg",
		gradient: "linear-gradient(to bottom, #1fe0c8, #7a5cff, #c43cff)",
	},
	{
		code: "EAGLEHB",
		name: "Eagle",
		subtitle: "fulfilling games",
		image: "/eagle-thumbnail-16x9.jpg",
		gradient: "linear-gradient(to bottom, #d9f27c, #8bbf4f, #5f9e7a)",
	},
	{
		code: "LUCKYRISEHB",
		name: "Lucky Rise",
		subtitle: "fulfilling games",
		image: "/luckyrise-thumbnail-16x9.png",
		gradient: "linear-gradient(to bottom, #0E0E2B, #1f3a5f, #d4a017)",
	},
	{
		code: "LAGOSRUSH",
		name: "Lagos Rush",
		subtitle: "fulfilling games",
		image: "/lagos-rush.png",
		gradient: "linear-gradient(to bottom, #ff6b35, #f7931e, #ffcc00)",
	},
];

function GamesPage() {
	const navigate = useNavigate();
	const [loadingGame, setLoadingGame] = useState<string | null>(null);

	const handleGameClick = async (game: (typeof GAMES)[number]) => {
		setLoadingGame(game.code);
		try {
			let launchUrl: string;

			const isLagosRush = game.code === "LAGOSRUSH";
			const url = isLagosRush
				? `${import.meta.env.VITE_SERVER_URL}lagos-rush/launcher`
				: `${import.meta.env.VITE_SERVER_URL}casino/play/${game.code}`;

			const response = await fetch(url, {
				method: "POST",
				credentials: "include",
			});

			const data: {
				success?: boolean;
				error?: string;
				data?: { gameUrl?: string; launchUrl?: string };
			} = await response.json();

			if (!response.ok || data.success === false) {
				if (data.error === "Unauthorized" || response.status === 401) {
					navigate({ to: "/auth/sign-in" });
					return;
				}
				throw new Error(data.error || "Failed to launch game");
			}

			launchUrl = data.data?.gameUrl ?? data.data?.launchUrl;

			if (!launchUrl) {
				throw new Error("Missing launch URL in response");
			}

			navigate({
				to: "/game/$gameId",
				params: { gameId: game.code },
				state: { gameUrl: launchUrl },
			});
		} catch (error) {
			console.error("Failed to launch game:", error);
		} finally {
			setLoadingGame(null);
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent,
		game: (typeof GAMES)[number],
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleGameClick(game);
		}
	};

	return (
		<div className="min-h-screen dark:bg-[#121212]">
			<div className="container mx-auto px-4 py-8">
				<h1 className="mb-6 font-bold text-2xl text-gray-900 dark:text-white">
					All Games
				</h1>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
					{GAMES.map((game) => (
						<div
							key={game.code}
							className="relative flex h-[280px] w-[180px] w-full cursor-pointer flex-col items-center justify-end overflow-hidden rounded-lg border border-gray-200 p-4"
							style={{ background: game.gradient }}
							onClick={() => handleGameClick(game)}
							onKeyDown={(e) => handleKeyDown(e, game)}
							role="button"
							tabIndex={0}
						>
							{loadingGame === game.code && (
								<div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
									<Loader2 className="h-10 w-10 animate-spin text-white" />
								</div>
							)}

							<img
								src={game.image}
								alt={game.name}
								className="absolute inset-0 h-full w-full object-contain p-2 transition-opacity"
								style={{ opacity: loadingGame === game.code ? 0.35 : 1 }}
							/>
							<p
								className="text-center font-normal text-[27px] text-white"
								style={{ fontFamily: "Luckiest Guy" }}
							>
								{game.name}
							</p>
							<p
								className="text-center text-gray-100 text-sm"
								style={{ fontFamily: "Quicksand" }}
							>
								{game.subtitle}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
