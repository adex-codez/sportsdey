import { ChevronRight } from "lucide-react";
import { type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { useActiveTab } from "./active-tab-context";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { SPORTS } from "@/lib/constants";
import { useCurrentSport } from "@/hooks/use-current-sport";
import BettingWidget from "./betting-widget";
import { useFavorites } from "@/hooks/useFavorites";

const SidebarItem = ({
	children,
	heading,
	icon: Icon,
}: PropsWithChildren<{
	heading: string;
	icon?: React.ReactNode;
}>) => {
	return (
		<div className="overflow-hidden rounded-2xl bg-white">
			<div className="flex items-center justify-between px-6 py-4">
				<p className="font-semibold text-primary text-xl">{heading}</p>
				{Icon && Icon}
			</div>
			<hr />
			{children}
		</div>
	);
};

const Sidebar = () => {
	const { tab, setTab } = useActiveTab();
	const navigate = useNavigate();
	const currentSport = useCurrentSport();
	const { favoriteTeams, favoriteLeagues, totalFavoritesCount, toggleFavoriteTeam, toggleFavoriteLeague } = useFavorites();

	return (
		<div className="space-y-8">
			<SidebarItem heading="Menu">
				<ul className="space-y-4 px-6 py-6">
					<li
						className={cn(
							"cursor-pointer",
							tab === "scores" ? "font-semibold text-accent" : null,
						)}
						onClick={() => {
							setTab("scores");
							const target =
								currentSport === SPORTS.TENNIS
									? "/tennis"
									: currentSport === SPORTS.BASKETBALL
										? "/basketball"
										: "/";
							navigate({ to: target, search: { league: undefined, sports: currentSport } as any });
						}}
					>
						Scores
					</li>
					<li
						className={cn(
							"cursor-pointer",
							tab === "favourites" ? "font-semibold text-accent" : null,
						)}
						onClick={() => {
							setTab("favourites");
							navigate({ to: "/favorites", search: { sports: currentSport } });
						}}
					>
						{" "}
						Favourite ({totalFavoritesCount})
					</li>
					<li
						className={cn(
							"cursor-pointer",
							tab === "news" ? "font-semibold text-accent" : null,
						)}
						onClick={() => {
							setTab("news");
							navigate({ to: "/news", search: { sports: currentSport } });
						}}
					>
						News
					</li>
				</ul>
			</SidebarItem>



			<div className="relative">
				<BettingWidget />
			</div>
			<SidebarItem heading="My Teams" icon={<ChevronRight />}>
				<div>
					{favoriteTeams.length === 0 ? (
						<p className="px-6 py-6 text-sm">
							{" "}
							You have no teams selected as favourites. Tap the star icon next to
							a team to add to favourites.
						</p>
					) : (
						<ul className="px-6 py-4 space-y-3">
							{favoriteTeams.map((team) => (
								<li key={team.id} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<img
											src={team.logo || '/Profile.png'}
											alt={team.name}
											className="w-8 h-8 object-contain"
										/>
										<span className="text-sm font-medium truncate max-w-[120px]" title={team.name}>{team.name}</span>
									</div>
									<button
										onClick={() => toggleFavoriteTeam(team)}
										className="text-yellow-400 hover:text-yellow-500"
									>
										★
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</SidebarItem>
			<SidebarItem heading="Convert Your betting code">
				<div className="space-y-4 px-6 py-6">
					<div className="w-ful space-y-2 rounded-2xl bg-white p-4 shadow-[2px_2px_23px_0_#0000000F]">
						<p className="font-medium text-sm">Booking Code</p>
						<input
							className="h-5 w-full rounded-sm bg-[#F0F0F0] p-4 text-sm"
							placeholder="Enter booking code"
						/>
					</div>
					<div className="w-ful space-y-2 rounded-2xl bg-white p-4 shadow-[2px_2px_23px_0_#0000000F]">
						<p className="font-medium text-sm">Convert code from</p>
						<input
							className="h-5 w-full rounded-sm bg-[#F0F0F0] p-4 text-sm"
							placeholder="Enter booking code"
						/>
					</div>
					<div className="w-ful space-y-2 rounded-2xl bg-white p-4 shadow-[2px_2px_23px_0_#0000000F]">
						<p className="font-medium text-sm">Convert to</p>
						<input
							className="h-5 w-full rounded-sm bg-[#F0F0F0] p-4 text-sm"
							placeholder="Enter booking code"
						/>
					</div>
					<Button className="w-full bg-accent py-6 text-[#fafafa]">
						Convert
					</Button>
				</div>
			</SidebarItem>
			<SidebarItem heading="My League" icon={<ChevronRight />}>
				<div>
					{favoriteLeagues.length === 0 ? (
						<p className="px-6 py-6 text-sm">
							{" "}
							You have no leagues selected as favourites. Tap the star icon in the
							league detail to add to favourites.
						</p>
					) : (
						<ul className="px-6 py-4 space-y-3">
							{favoriteLeagues.map((league) => (
								<li key={league.id} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<img
											src={league.flag || '/International.png'}
											alt={league.name}
											className="w-8 h-8 rounded-full object-cover"
										/>
										<span className="text-sm font-medium truncate max-w-[120px]" title={league.name}>{league.name}</span>
									</div>
									<button
										onClick={() => toggleFavoriteLeague(league)}
										className="text-yellow-400 hover:text-yellow-500"
									>
										★
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</SidebarItem>
		</div>
	);
};

export default Sidebar;
