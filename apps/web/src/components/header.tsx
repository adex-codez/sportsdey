import {
	Link,
	useLocation,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { CalendarDays, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWeekDates from "@/hooks/use-weekdates";
import { cn } from "@/lib/utils";
import BasketballIcon from "@/logos/basketball.svg?react";
import FootballIcon from "@/logos/football.svg?react";
import WorldIcon from "@/logos/world.svg?react";
import { useDateContext } from "./date-context";
import { Button } from "./ui/button";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { SPORTS } from "@/lib/constants";
import { useActiveTab } from "./active-tab-context";
import { useFavorites } from "@/hooks/useFavorites";
import { useCurrentFilter } from "@/hooks/use-current-filter";
import { socials } from "./socials";

export default function Header() {
	const currentSport = useCurrentSport();
	const { setTab, tab } = useActiveTab();
	const { totalFavoritesCount } = useFavorites();
	useEffect(() => {
		console.log(currentSport);
	}, [currentSport]);

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
	const location = useLocation();
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

	return (
		<div className="z-30 w-full pb-4 lg:pb-0">
			<div className="h-[60px] w-full bg-primary px-4 py-1 text-foreground lg:flex lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-[10%] lg:py-1">
				<div className="flex min-w-0 justify-between">
					<button
						className="lg:hidden"
						type="button"
						onClick={() => setOpen(!open)}
						ref={menuButtonRef}
						aria-expanded={open}
						aria-controls="mobile-menu"
						aria-label={open ? "Close main menu" : "Open main menu"}
					>
						<Menu width={36} height={36} color="#f4f4f4" />
					</button>
					<div className="flex min-w-0 justify-center self-center">
						<img
							src="/sportsdey-logo.png"
							className="h-10"
							alt="sportsdey's logo"
						/>
					</div>
					<div className="lg:hidden" />
				</div>

				<div className="hidden min-w-0 lg:flex">
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
											: "text-secondary",
									)}
								>
									<Icon />
									<p>{label}</p>
								</Link>
							))}
						</nav>
					</div>
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

						<div className="min-w-0 space-y-8 text-base">
							<div className="">
								<div className="w-full px-4 bg-[#202120] py-4 text-base">
									Features
								</div>
								<ul className="space-y-4 px-4 mt-4">
									<li
										className={cn(
											"cursor-pointer",
											currentFilter === "all" ? "text-accent" : "",
										)}
										onClick={() => {
											setOpen(false);
											changeCurrentFilter("all");
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
										}}
									>
										Upcoming
									</li>
								</ul>
							</div>
							<div className="">
								<div className="w-full px-4 bg-[#202120] py-4 text-base">
									Info
								</div>
								<ul className="space-y-4 px-4 mt-4">
									<li
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
										Betting
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
							</div>
							<div className="">
								<div className="w-full px-4 bg-[#202120] py-4 text-base">
									Social Links
								</div>
								<div className="flex items-center gap-2 px-4 mt-4">
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
								const target =
									currentSport === SPORTS.TENNIS
										? "/tennis"
										: currentSport === SPORTS.BASKETBALL
											? "/basketball"
											: "/";
								router.navigate({
									to: target,
									search: { league: undefined, sports: currentSport } as any,
								});
							}}
							className="font-semibold text-secondary text-sm"
						>
							Scores
						</li>
						<li>
							<Link
								to="/betting"
								className="font-semibold text-secondary text-sm"
								onClick={() => setTab("betting")}
							>
								Betting
							</Link>
						</li>
						<li
							onClick={() => {
									setTab("news");
									router.navigate({
										to: "/news",
										search: { sports: currentSport },
									});
								}}
						>
							<a
								href="#"
								className="font-semibold text-secondary text-sm"
								
							>
								News
							</a>
						</li>
					</ul>
				</div>

				<div className="flex w-[98vw] overflow-x-auto md:w-full justify-center">
					{/* <nav className="flex w-max items-center justify-center gap-4 border border-[#414141] md:border-0 px-4 py-4"> */}
					<nav className="flex w-max items-center justify-center gap-4 px-4 py-4">
						{links.map(({ to, label, icon: Icon, sport }) => (
							<Link
								key={to}
								to={to as string}
								onClick={() => setTab("scores")}
								className={cn(
									"flex shrink-0 gap-2 whitespace-nowrap",
									currentSport === sport
										? "flex-shrink-0 flex gap-2 bg-[#202120] text-secondary border-accent border-2 whitespace-nowrap rounded-full py-2 px-4"
										: "flex-shrink-0 flex gap-2 text-secondary whitespace-nowrap",
								)}
							>
								<Icon />
								<p>{label}</p>
							</Link>
						))}
					</nav>
				</div>

				{!location.pathname.startsWith("/news") &&
				!location.pathname.startsWith("/betting") ? (
					<div className="flex w-full items-center justify-between bg-[#202120] px-4 py-2 md:gap-0 md:px-6">
						{weekDates.map((weekDate, index) => (
							//@biome-ignore lint
							<div
								key={`date-${index}`}
								onClick={() => {
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
									weekDate.toDateString() === date.toDateString()
										? "text-secondary"
										: "text-[#6C7073]",
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
						))}
						<button
							type="button"
							className="rounded-lg border border-[#777] bg-primary p-2 active:scale-95 transition-transform opacity-50 cursor-not-allowed"
							title="Calendar disabled for this release"
						>
							<CalendarDays className="text-secondary" width={24} height={24} />
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}
