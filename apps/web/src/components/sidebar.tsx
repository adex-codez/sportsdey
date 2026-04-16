import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { SPORTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import gamesIcon from "@/logos/games.svg";
import jackpotIcon from "@/logos/jackpot.svg";
import newsIcon from "@/logos/news.svg";
import quickbetsIcon from "@/logos/quick-bets.svg";
import scoreIcon from "@/logos/score.svg";
import smartbetsIcon from "@/logos/smartbet.svg";
import superbetsIcon from "@/logos/superbet.svg";
import walletIcon from "@/logos/wallet.svg";
import { useActiveTab } from "./active-tab-context";

type NavItem = {
	id: string;
	label: string;
	icon: string;
	onClick?: () => void;
	isActive: boolean;
};

const Sidebar = () => {
	const isStaging =
		import.meta.env.MODE === "staging" ||
		import.meta.env.VITE_ENVIRONMENT === "staging";
	const { tab, setTab } = useActiveTab();
	const navigate = useNavigate();
	const location = useLocation();
	const searchStr = location.search || "";
	const currentSport = useCurrentSport();
	const params = new URLSearchParams(searchStr);
	const betType =
		location.pathname.startsWith("/betting") && params.get("type")
			? params.get("type")!
			: "jackpots";

	const goToScores = () => {
		setTab("scores");
		const targetSport = currentSport || SPORTS.FOOTBALL;
		const target =
			targetSport === SPORTS.TENNIS
				? "/tennis"
				: targetSport === SPORTS.BASKETBALL
					? "/basketball"
					: "/";
		navigate({
			to: target,
			search: { league: undefined, sports: targetSport } as any,
		});
	};

	const goToNews = () => {
		setTab("news");
		navigate({
			to: "/news",
			search: { sports: currentSport || SPORTS.FOOTBALL },
		});
	};

	const goToGames = () => {
		setTab("games");
		navigate({ to: "/games" });
	};

	const goToWallet = () => navigate({ to: "/wallet" });
	// const goToBetting = (betType: string) =>
	// navigate({
	// 	to: "/betting",
	// 	search: { type: betType },
	// });

	const menuItems: NavItem[] = [
		{
			id: "scores",
			label: "Scores",
			icon: scoreIcon,
			onClick: goToScores,
			isActive:
				tab === "scores" ||
				["/", "/basketball", "/tennis"].includes(location.pathname),
		},
		{
			id: "news",
			label: "News",
			icon: newsIcon,
			onClick: goToNews,
			isActive: tab === "news" || location.pathname.startsWith("/news"),
		},
		...(isStaging || import.meta.env.DEV
			? [
					{
						id: "casino",
						label: "Casino",
						icon: gamesIcon,
						onClick: goToGames,
						isActive:
							tab === "games" ||
							location.pathname.startsWith("/games") ||
							location.pathname.startsWith("/game/"),
					},
				]
			: []),
		{
			id: "wallet",
			label: "Wallet",
			icon: walletIcon,
			onClick: goToWallet,
			isActive: location.pathname.startsWith("/wallet"),
		},
	];

	const bettingItems: NavItem[] = [
		{
			id: "jackpots",
			label: "Jackpots",
			icon: jackpotIcon,
			// onClick: () => goToBetting("jackpots"),
			isActive:
				location.pathname.startsWith("/betting") &&
				(betType === "jackpots" || !params.has("type")),
		},
		{
			id: "super-bets",
			label: "Super Bets",
			icon: superbetsIcon,
			// onClick: () => goToBetting("super"),
			isActive: location.pathname.startsWith("/betting") && betType === "super",
		},
		{
			id: "smart-bets",
			label: "Smart Bets",
			icon: smartbetsIcon,
			// onClick: () => goToBetting("smart"),
			isActive: location.pathname.startsWith("/betting") && betType === "smart",
		},
		{
			id: "quick-bets",
			label: "Quick Bets",
			icon: quickbetsIcon,
			// onClick: () => goToBetting("quick"),
			isActive: location.pathname.startsWith("/betting") && betType === "quick",
		},
	];

	const renderNavButton = (item: NavItem) => (
		<button
			key={item.id}
			onClick={item.onClick}
			className={cn(
				"flex w-full cursor-pointer flex-col items-center gap-1 rounded-full px-3 py-1 transition hover:-translate-y-[1px]",
				item.isActive
					? "bg-accent text-white shadow-[0_8px_20px_rgba(25,186,8,0.18)]"
					: "bg-transparent",
			)}
		>
			<img
				src={item.icon}
				alt={item.label}
				className={cn(
					"h-6 w-6 transition",
					item.isActive ? "opacity-100 brightness-0 invert" : "opacity-70",
					item.id === "wallet" && "bg-gray-400",
					item.id === "scores" &&
						(item.isActive
							? "brightness-0 invert"
							: "brightness-95% contrast-95% hue-rotate-[85deg] invert-[32%] saturate-[1200%] sepia-[78%]"),
				)}
			/>
			<span
				className={cn(
					"font-semibold text-[#9EA1A7] text-[13px]",
					item.isActive && "text-white",
				)}
			>
				{item.label}
			</span>
		</button>
	);

	return (
		<div className="mx-auto w-[110px] rounded-[26px] border border-[#F1F2F4] bg-white py-5 shadow-[0_6px_22px_rgba(0,0,0,0.12)] dark:border-[#2F3033] dark:bg-[#1C1D1F]">
			<div className="space-y-4">
				<div className="px-3">
					<p className="text-center font-semibold text-[#202120] text-[15px] dark:text-white">
						Menu
					</p>
					<div className="mt-3 space-y-2">{menuItems.map(renderNavButton)}</div>
				</div>

				<div className="mx-3 h-px bg-[#E9E9E9] dark:bg-[#2F3033]" />

				<div className="px-3">
					<p className="text-center font-semibold text-[#202120] text-[15px] dark:text-white">
						Betting
					</p>
					<div className="mt-3 space-y-2">
						{bettingItems.map(renderNavButton)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
