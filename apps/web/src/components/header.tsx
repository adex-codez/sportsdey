import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWeekDates from "@/hooks/use-weekdates";
import { cn } from "@/lib/utils";
import BaseballIcon from "@/logos/baseball.svg?react";
import BasketballIcon from "@/logos/basketball.svg?react";
import BoxingIcon from "@/logos/boxing.svg?react";
import FootballIcon from "@/logos/football.svg?react";
import TennisIcon from "@/logos/tennis.svg?react";
import WorldIcon from "@/logos/world.svg?react";
import { useDateContext } from "./date-context";
import { Button } from "./ui/button";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { SPORTS } from "@/lib/constants";
import { useActiveTab } from "./active-tab-context";

export default function Header() {
	const currentSport = useCurrentSport();
	const { setTab } = useActiveTab();

	const links = [
		{ to: "/", label: "Football", icon: FootballIcon, sport: SPORTS.FOOTBALL },
		{
			to: "/basketball",
			label: "Basketball",
			icon: BasketballIcon,
			sport: SPORTS.BASKETBALL,
		},
		{ to: "/tennis", label: "Tennis", icon: TennisIcon, sport: SPORTS.TENNIS },
		{ to: "/boxing", label: "Boxing", icon: BoxingIcon, sport: "boxing" },
		{ to: "/ufc", label: "UFC", icon: BaseballIcon, sport: "ufc" },
	] as const;

	const [open, setOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const { date, setDate } = useDateContext();
	const weekDates = useWeekDates();


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
		<div className="sticky not-[lg]:top-0 z-30 w-full lg:static">
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

				<div className="hidden min-w-0 gap-2 lg:flex">
					<Button className="flex gap-2 rounded-full bg-[#FFFFFF33]">
						<WorldIcon />
						EN
						<ChevronDown />
					</Button>
					<Button className="rounded-full bg-accent">
						Bet code converter
						<ChevronRight />
					</Button>
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
							<div />
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

						<div className="min-w-0 space-y-8 px-8">
							<div className="space-y-4">
								<p className="font-semibold text-lg">Menu</p>
								<hr />
								<ul className="space-y-2">
									<li>Scores</li>
									<li>Favourites (0)</li>
									<li>News</li>
								</ul>
							</div>

							<div className="space-y-4">
								<p className="font-semibold text-lg">Betting Tips</p>
								<hr />
								<ul className="space-y-2">
									<li>Value Bets</li>
									<li>Trends</li>
									<li>Streaks</li>
									<li>Daily Acca</li>
								</ul>
							</div>

							<p>My Teams</p>
							<p>My Leagues</p>
						</div>
					</aside>
				</div>
			</div>

			<div className="w-full bg-primary lg:hidden">
				<div className="flex justify-center border border-[#414141] py-3">
					<ul className="flex gap-6">
						<li>
							<a href="#" className="font-semibold text-secondary text-sm">
								Scores
							</a>
						</li>
						<li>
							<a href="#" className="font-semibold text-secondary text-sm">
								Betting
							</a>
						</li>
						<li>
							<a href="#" className="font-semibold text-secondary text-sm">
								News
							</a>
						</li>
					</ul>
				</div>

				<div className="flex w-[98vw] overflow-x-auto md:w-full md:justify-center">
					<nav className="flex w-max items-center gap-4 border border-[#414141] px-4 py-4">
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

				<div className="flex w-full items-center justify-between bg-[#202120] px-4 py-2 md:gap-0 md:px-6">
					{weekDates.map((weekDate, index) => (
						//@biome-ignore lint
						<div
							key={`date-${index}`}
							onClick={() => setDate(weekDate)}
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
								{new Intl.DateTimeFormat("en-US", {
									weekday: "short",
								}).format(weekDate)}
							</p>
							<p className="">{weekDate.getDate()}</p>
						</div>
					))}
					<div className="rounded-lg border border-[#777] bg-primary p-2">
						<CalendarDays className="text-secondary" width={24} height={24} />
					</div>
				</div>
			</div>
		</div>
	);
}
