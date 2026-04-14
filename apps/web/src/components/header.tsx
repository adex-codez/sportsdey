import {
	Link,
	useLocation,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import {
	CalendarDays,
	ChevronDown,
	ChevronRight,
	Menu,
	Undo2,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCurrentFilter } from "@/hooks/use-current-filter";
import { useCurrentSport } from "@/hooks/use-current-sport";
import useWeekDates from "@/hooks/use-weekdates";
import { useFavorites } from "@/hooks/useFavorites";
import { SPORTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import BasketballIcon from "@/logos/basketball.svg?react";
import FootballIcon from "@/logos/football.svg?react";
import WorldIcon from "@/logos/world.svg?react";
import CalendarBadge from "@/shared/CalendarBadge";
import { useActiveTab } from "./active-tab-context";
import { useDateContext } from "./date-context";
import { socials } from "./socials";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserMenu } from "./user-menu";

type HeaderProps = {
	hideSportsNav?: boolean;
};

export default function Header({ hideSportsNav = false }: HeaderProps) {
	const location = useLocation();
	const isAuthRoute = location.pathname.startsWith("/auth");
	const shouldHideSportsNav = hideSportsNav || isAuthRoute;
	const currentSport = useCurrentSport();
	const { setTab, tab } = useActiveTab();
	// const { totalFavoritesCount } = useFavorites();

	const links = [
		{ to: "/", label: "Football", icon: FootballIcon, sport: SPORTS.FOOTBALL },
		{
			to: "/basketball",
			label: "Basketball",
			icon: BasketballIcon,
			sport: SPORTS.BASKETBALL,
		},
		// { to: "/tennis", label: "Tennis", icon: TennisIcon, sport: SPORTS.TENNIS },
		// { to: "/boxing", label: "Boxing", icon: BoxingIcon, sport: "boxing" },
		// { to: "/ufc", label: "UFC", icon: BaseballIcon, sport: "ufc" },
	] as const;

	const [open, setOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const { date, setDate } = useDateContext();
	const weekDates = useWeekDates(date);
	const { currentFilter, changeCurrentFilter } = useCurrentFilter();
	const router = useRouter();

	const params = useParams({ strict: false });
	const hasPathParams = Object.keys(params).length > 0;

	useEffect(() => {
		if (open) {
			document.documentElement.classList.add("overflow-hidden");
			closeButtonRef.current?.focus();
		} else {
			document.documentElement.classList.remove("overflow-hidden");
			menuButtonRef.current?.focus();
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.documentElement.classList.remove("overflow-hidden");
		};
	}, [open]);

	const handleBackToSite = () => {
		if (typeof window !== "undefined" && window.history.length > 1) {
			window.history.back();
			return;
		}
		router.navigate({ to: "/" });
	};

	return (
		<div className="z-30 w-full pb-4 lg:pb-0">
			<div className="h-[60px] w-full bg-primary px-4 py-1 text-foreground lg:flex lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-[10%] lg:py-1">
				<div className="flex min-w-0 items-center justify-between lg:hidden">
					<button
						type="button"
						onClick={() => setOpen(!open)}
						ref={menuButtonRef}
						aria-expanded={open}
						aria-controls="mobile-menu"
						aria-label={open ? "Close main menu" : "Open main menu"}
					>
						<Menu width={36} height={36} color="#f4f4f4" />
					</button>
					<Link
						to="/"
						search={{
							league: undefined,
							sports: currentSport || SPORTS.FOOTBALL,
						}}
					>
						<div className="flex min-w-0 justify-center self-center">
							<img
								src="/sportsdey-logo.png"
								className="h-10"
								alt="sportsdey's logo"
							/>
						</div>
					</Link>

					{/*<div className="flex items-center gap-3">
						{!isAuthRoute && <UserMenu />}
						<ThemeToggle />
						{isAuthRoute && (
							<button
								type="button"
								onClick={handleBackToSite}
								className="flex items-center gap-1 text-secondary hover:text-white"
							>
								<Undo2 className="h-4 w-4" />
								<span className="text-sm underline">Back to site</span>
							</button>
						)}
					</div>*/}
				</div>

				<div className="hidden min-w-0 lg:flex lg:h-full lg:w-full lg:items-center lg:justify-between">
					<Link
						to="/"
						search={{
							league: undefined,
							sports: currentSport || SPORTS.FOOTBALL,
						}}
					>
						<img
							src="/sportsdey-logo.png"
							className="h-12"
							alt="sportsdey's logo"
						/>
					</Link>

					{!shouldHideSportsNav && (
						<div className="overflow-x-auto">
							<nav className="cust-scrollbar flex w-max gap-4 py-4 font-medium">
								{links.map(({ to, label, icon: Icon, sport }) => (
									<Link
										key={to}
										to={to as string}
										onClick={() => setTab("scores")}
										search={{ sports: sport }}
										className={cn(
											"flex shrink-0 gap-2 pb-2",
											currentSport === sport
												? "border-accent border-b-2 text-accent"
												: "text-secondary dark:text-white",
										)}
									>
										<Icon />
										<p>{label}</p>
									</Link>
								))}
							</nav>
						</div>
					)}

					{/*<div className="flex items-center gap-2">
						{!isAuthRoute && <UserMenu />}
						<ThemeToggle />
						{isAuthRoute && (
							<button
								type="button"
								onClick={handleBackToSite}
								className="flex items-center gap-1 text-secondary hover:text-white"
							>
								<Undo2 className="h-4 w-4" />
								<span className="text-sm underline">Back to site</span>
							</button>
						)}
					</div>*/}
				</div>

				<div className="min-w-0">
					{/* <Button className="flex gap-2 rounded-full bg-[#FFFFFF33]">
						<WorldIcon />
						EN
						<ChevronDown />
					</Button>
					<Button className="rounded-full bg-accent">
						Bet code converter
						<ChevronRight />
					</Button> */}
				</div>

				{/* MOBILE SLIDE MENU */}
				<div
					className={cn(
						"fixed inset-0 z-50",
						open ? "pointer-events-auto" : "pointer-events-none",
					)}
				>
					<div
						className={cn(
							"absolute inset-0 bg-black transition-opacity duration-300",
							open ? "opacity-50" : "opacity-0",
						)}
						onClick={() => setOpen(false)}
						aria-hidden="true"
					/>
					<aside
						id="mobile-menu"
						role="dialog"
						aria-modal="true"
						className={cn(
							"fixed top-0 left-0 h-full w-[80%] transform bg-primary text-background shadow-xl transition-transform duration-300 sm:w-80",
							open ? "translate-x-0" : "-translate-x-full",
						)}
					>
						<div className="flex min-w-0 justify-between p-4">
							<img
								src="/sportsdey-logo.png"
								className="h-10"
								alt="sportsdey's logo"
							/>
							<button
								ref={closeButtonRef}
								type="button"
								className="p-2"
								aria-label="Close main menu"
								onClick={() => setOpen(false)}
							>
								<X width={28} height={28} color="#f4f4f4" />
							</button>
						</div>

						<div className="min-w-0 space-y-8 text-base dark:text-white">
							<div className="">
								<div className="w-full bg-[#202120] px-4 py-4 text-base">
									Features
								</div>
								<ul className="mt-4 space-y-4 px-4">
									<li
										className={cn(
											"cursor-pointer",
											currentFilter === "all" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											changeCurrentFilter("all");
											setTab("scores");
											const target =
												currentSport === SPORTS.TENNIS
													? "/tennis"
													: currentSport === SPORTS.BASKETBALL
														? "/basketball"
														: "/";
											router.navigate({
												to: target,
												search: {
													league: undefined,
													sports: currentSport,
												} as any,
											});
										}}
									>
										All
									</li>
									<li
										className={cn(
											"cursor-pointer",
											currentFilter === "live" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											changeCurrentFilter("live");
											setTab("scores");
											const target =
												currentSport === SPORTS.TENNIS
													? "/tennis"
													: currentSport === SPORTS.BASKETBALL
														? "/basketball"
														: "/";
											router.navigate({
												to: target,
												search: {
													league: undefined,
													sports: currentSport,
												} as any,
											});
										}}
									>
										Live
									</li>
									<li
										className={cn(
											"cursor-pointer",
											currentFilter === "finished" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											changeCurrentFilter("finished");
											setTab("scores");
											const target =
												currentSport === SPORTS.TENNIS
													? "/tennis"
													: currentSport === SPORTS.BASKETBALL
														? "/basketball"
														: "/";
											router.navigate({
												to: target,
												search: {
													league: undefined,
													sports: currentSport,
												} as any,
											});
										}}
									>
										Finished
									</li>
									<li
										className={cn(
											"cursor-pointer",
											currentFilter === "upcoming" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											changeCurrentFilter("upcoming");
											setTab("scores");
											const target =
												currentSport === SPORTS.TENNIS
													? "/tennis"
													: currentSport === SPORTS.BASKETBALL
														? "/basketball"
														: "/";
											router.navigate({
												to: target,
												search: {
													league: undefined,
													sports: currentSport,
												} as any,
											});
										}}
									>
										Upcoming
									</li>
								</ul>
							</div>

							<div className="dark:text-white">
								<div className="w-full bg-[#202120] px-4 py-4 text-base">
									Betting
								</div>
								<ul className="mt-4 space-y-4 px-4">
									{/* <li
										className={cn(
											"cursor-pointer",
											tab === "betting" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											setTab("betting");
											router.navigate({ to: "/betting" });
										}}
									>
										Play bet
									</li> */}
									<li>
										<a
											href="https://sportsdey.com/betting"
											target="_blank"
											rel="noopener noreferrer"
											className="flex cursor-pointer items-center gap-2"
										>
											<img
												src="/betting-logo.png"
												className="h-5 w-5 object-contain"
												alt="Betting"
											/>
											SmartBet
										</a>
									</li>
									<li>
										<a
											href="https://sportsdey.com/betting"
											target="_blank"
											rel="noopener noreferrer"
											className="flex cursor-pointer items-center gap-2"
										>
											<img
												src="/betting-logo.png"
												className="h-5 w-5 object-contain"
												alt="Betting"
											/>
											Jackpot
										</a>
									</li>
									<li>
										<a
											href="https://sportsdey.com/betting"
											target="_blank"
											rel="noopener noreferrer"
											className="flex cursor-pointer items-center gap-2"
										>
											<img
												src="/betting-logo.png"
												className="h-5 w-5 object-contain"
												alt="Betting"
											/>
											QuickBetx
										</a>
									</li>
									<li>
										<a
											href="https://hallalotto.com/"
											target="_blank"
											rel="noopener noreferrer"
											className="flex cursor-pointer items-center gap-2"
										>
											<img
												src="/betting-logo.png"
												className="h-5 w-5 object-contain"
												alt="Betting"
											/>
											Play lottery
										</a>
									</li>

									{/* <li
									>
										About us
									</li>
									<li
									>
										Finished
									</li> */}
								</ul>
								<ul className="mt-4 space-y-4 px-4" />
							</div>
							<div className="">
								<div className="w-full bg-[#202120] px-4 py-4 text-base">
									Social Links
								</div>
								<div className="mt-4 flex items-center gap-2 px-4">
									{socials.map(({ icon: Icon, id, link }) => (
										<a
											key={id}
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex size-8 items-center justify-center rounded-full bg-white p-2"
										>
											<Icon />
										</a>
									))}
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>

			<div className="w-full bg-primary lg:hidden">
				<div className="flex justify-center border border-[#414141] py-3">
					<ul className="flex gap-6">
						<li
							onClick={() => {
								setTab("scores");
								const targetSport = currentSport || SPORTS.FOOTBALL;
								const target =
									targetSport === SPORTS.TENNIS
										? "/tennis"
										: targetSport === SPORTS.BASKETBALL
											? "/basketball"
											: "/";
								router.navigate({
									to: target,
									search: { league: undefined, sports: targetSport } as any,
								});
							}}
							className={cn(
								"cursor-pointer font-semibold text-lg transition-colors",
								tab === "scores"
									? "text-accent"
									: "text-secondary dark:text-white",
							)}
						>
							Scores
						</li>
						{/* <li>
							<Link
								to="/betting"
								className={cn(
									"font-semibold text-lg transition-colors",
									tab === "betting"
										? "text-accent"
										: "text-secondary dark:text-white",
								)}
								onClick={() => setTab("betting")}
							>
								Betting
							</Link>
						</li> */}
						<li>
							<Link
								to="/news"
								search={{ sports: currentSport, tab: "news" }}
								className={cn(
									"font-semibold text-lg transition-colors",
									tab === "news"
										? "text-accent"
										: "text-secondary dark:text-white",
								)}
								onClick={() => setTab("news")}
							>
								News
							</Link>
						</li>
						<li>
							<Link
								to="/news"
								search={{ sports: currentSport, tab: "videos" }}
								className={cn(
									"font-semibold text-lg transition-colors",
									tab === "videos"
										? "text-accent"
										: "text-secondary dark:text-white",
								)}
								onClick={() => setTab("videos")}
							>
								Videos
							</Link>
						</li>
					</ul>
				</div>

				<div className="flex w-[98vw] justify-center overflow-x-auto md:w-full dark:border-[#5A5F63] dark:border-b">
					{/* <nav className="flex w-max items-center justify-center gap-4 border border-[#414141] md:border-0 px-4 py-4"> */}
					<nav className="flex w-max items-center justify-center gap-2 px-4 py-3">
						{links.map(({ to, label, icon: Icon, sport }) => (
							<Link
								key={to}
								to={to as string}
								onClick={() => setTab("scores")}
								className={cn(
									"flex shrink-0 gap-1 whitespace-nowrap",
									currentSport === sport
										? "flex flex-shrink-0 gap-1 whitespace-nowrap rounded-full border-2 border-accent bg-[#202120] px-3 py-1 text-secondary dark:text-white"
										: "flex flex-shrink-0 gap-1 whitespace-nowrap text-secondary dark:text-white",
								)}
							>
								<Icon className="h-4 w-4" />
								<p className="text-xs">{label}</p>
							</Link>
						))}
					</nav>
				</div>

				{!location.pathname.startsWith("/news") &&
				!location.pathname.startsWith("/betting") ? (
					<div className="flex w-full items-center justify-between bg-[#202120] px-4 py-2 md:gap-0 md:px-6">
						{(() => {
							const today = new Date();
							const day = today.getDay(); // 0 is Sunday
							const diff = today.getDate() - day;

							const minDate = new Date(today);
							minDate.setDate(diff);
							minDate.setHours(0, 0, 0, 0);

							const maxDate = new Date(minDate);
							maxDate.setDate(minDate.getDate() + 7);
							maxDate.setHours(23, 59, 59, 999);

							return weekDates.map((weekDate, index) => {
								const isDisabled = weekDate < minDate || weekDate > maxDate;

								return (
									//@biome-ignore lint
									<div
										key={`date-${index}`}
										onClick={() => {
											if (isDisabled) return;
											setDate(weekDate);
											if (hasPathParams) {
												const target =
													currentSport === SPORTS.TENNIS
														? "/tennis"
														: currentSport === SPORTS.BASKETBALL
															? "/basketball"
															: "/";
												router.navigate({
													to: target,
													search: {
														league: undefined,
														sports: currentSport,
													} as any,
												});
											}
										}}
										className={cn(
											"flex flex-col text-center",
											isDisabled
												? "pointer-events-none cursor-not-allowed opacity-30"
												: "",
											!isDisabled &&
												weekDate.toDateString() === date.toDateString()
												? "text-secondary dark:text-white"
												: !isDisabled
													? "text-[#6C7073] dark:text-gray-400"
													: "text-[#6C7073] dark:text-gray-600",
										)}
									>
										<p
											className={cn(
												"font-medium",
												weekDate.toDateString() === date.toDateString()
													? "text-base"
													: "text-sm",
											)}
										>
											{weekDate.toDateString() === new Date().toDateString()
												? "Today"
												: new Intl.DateTimeFormat("en-US", {
														weekday: "short",
													}).format(weekDate)}
										</p>
										<p className="">{weekDate.getDate()}</p>
									</div>
								);
							});
						})()}
						{/* <button
							type="button"
							className="cursor-not-allowed rounded-lg border border-[#777] bg-primary p-2 opacity-50 transition-transform active:scale-95"
							title="Calendar disabled for this release"
						>
							<CalendarDays className="text-secondary" width={24} height={24} />

						</button> */}
					</div>
				) : null}
			</div>
		</div>
	);
}
