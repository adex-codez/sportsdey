import { createFileRoute } from "@tanstack/react-router";
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
];

function GamesPage() {
	const [loadingGame, setLoadingGame] = useState<string | null>(null);

	const handleGameClick = async (gameCode: string) => {
		setLoadingGame(gameCode);
		try {
			const url = `${import.meta.env.VITE_SERVER_URL}casino/play/${gameCode}`;
			const response = await fetch(url, {
				method: "POST",
				credentials: "include",
			});

			const data: {
				success?: boolean;
				error?: string;
				launch_token?: string;
				data?: { launch_token?: string };
			} = await response.json();

			if (!response.ok || data.success === false) {
				if (data.error === "Unauthorized" || response.status === 401) {
					window.location.href = "/auth/sign-in";
					return;
				}
				throw new Error(data.error || "Failed to load game");
			}

			const launchToken = data.data?.launch_token || data.launch_token;
			if (launchToken) {
				window.location.href = launchToken;
			}
		} catch (error) {
			console.error("Failed to launch game:", error);
			setLoadingGame(null);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, gameCode: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleGameClick(gameCode);
		}
	};

	return (
		<div className="min-h-screen dark:bg-[#121212]">
			<div className="container mx-auto px-4 py-8">
				<h1 className="mb-6 font-bold text-2xl text-gray-900 dark:text-white">
					All Games
				</h1>
				<div className="flex flex-wrap gap-6">
					{GAMES.map((game) => (
						<div
							key={game.code}
							className="flex h-[280px] w-[220px] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-lg border border-gray-200 p-4"
							style={{ background: game.gradient }}
							onClick={() => handleGameClick(game.code)}
							onKeyDown={(e) => handleKeyDown(e, game.code)}
							role="button"
							tabIndex={0}
						>
							{loadingGame === game.code ? (
								<Loader2 className="h-8 w-8 animate-spin text-white" />
							) : (
								<>
									<img
										src={game.image}
										alt={game.name}
										className="h-40 w-full rounded-lg object-contain"
									/>
									<p
										className="text-center font-normal text-[27px] text-white"
										style={{ fontFamily: "Luckiest Guy" }}
									>
										{game.name}
									</p>
									<p
										className="text-center text-gray-300 text-sm"
										style={{ fontFamily: "Quicksand" }}
									>
										{game.subtitle}
									</p>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
