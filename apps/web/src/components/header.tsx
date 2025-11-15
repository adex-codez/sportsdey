import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import BaseballIcon from "@/logos/baseball.svg?react";
import BasketballIcon from "@/logos/basketball.svg?react";
import BoxingIcon from "@/logos/boxing.svg?react";
import FootballIcon from "@/logos/football.svg?react";
import IceHockeyIcon from "@/logos/icehockey.svg?react";
import TennisIcon from "@/logos/tennis.svg?react";
import VolleyballIcon from "@/logos/volleyball.svg?react";
import WorldIcon from "@/logos/world.svg?react";
import { Button } from "./ui/button";

export default function Header() {
	const links = [
		{ to: "/", label: "Football", icon: FootballIcon },
		{ to: "/basketball", label: "Basketball", icon: BasketballIcon },
		{ to: "/tennis", label: "Tennis", icon: TennisIcon },
		{ to: "/volleyball", label: "Volleyball", icon: VolleyballIcon },
		{ to: "/ice-hockey", label: "Ice Hockey", icon: IceHockeyIcon },
		{ to: "/baseball", label: "Baseball", icon: BaseballIcon },
		{ to: "/boxing", label: "Boxing", icon: BoxingIcon },
	] as const;
	const [open, setOpen] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		// Lock body scroll while menu is open and manage basic focus
		if (open) {
			document.documentElement.classList.add("overflow-hidden");
			// move focus into the panel to the close button
			closeButtonRef.current?.focus();
		} else {
			document.documentElement.classList.remove("overflow-hidden");
			// restore focus to the menu button when closing
			menuButtonRef.current?.focus();
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.documentElement.classList.remove("overflow-hidden");
		};
	}, [open]);

	return (
		<div className="flex h-[140px] w-full flex-col justify-center overflow-x-hidden bg-primary px-4 py-1 text-foreground md:h-20 md:flex-row md:items-center md:justify-between md:px-[104px]">
			<div className="flex justify-between">
				<button
					className="md:hidden"
					type="button"
					onClick={() => setOpen(!open)}
					ref={menuButtonRef}
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label={open ? "Close main menu" : "Open main menu"}
				>
					<Menu width={36} height={36} color="#f4f4f4" />
				</button>
				<div className="flex justify-center">
					{" "}
					<img
						src="sportsdey-logo.png"
						className="h-10"
						alt="sportsdey's logo"
					/>
				</div>
				<div />
			</div>

			<nav className="cust-scrollbar flex gap-4 overflow-x-auto py-4 font-medium text-base">
				{links.map(({ to, label, icon: Icon }) => {
					return (
						<Link key={to} to={to} className="flex shrink-0 gap-2">
							<Icon />
							<p className="text-secondary">{label}</p>
						</Link>
					);
				})}
			</nav>
			<div className="hidden gap-2 md:flex">
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
			<div
				className={cn(
					"fixed inset-0 z-50",
					open ? "pointer-events-auto" : "pointer-events-none",
				)}
			>
				{/* Backdrop */}
				<div
					className={cn(
						"absolute inset-0 bg-black transition-opacity duration-300",
						open ? "opacity-50" : "opacity-0",
					)}
					onClick={() => setOpen(false)}
					aria-hidden="true"
				/>
				{/* Sliding panel (no menu content yet) */}
				<aside
					id="mobile-menu"
					role="dialog"
					aria-modal="true"
					className={cn(
						"fixed top-0 left-0 h-full w-[80%] transform bg-primary text-background shadow-xl transition-transform duration-300 sm:w-80",
						open ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<div className="flex justify-between p-4">
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
					<div className="space-y-8 px-8">
						<div className="space-y-4">
							<div className="space-y-2">
								<p className="font-semibold text-lg">Menu</p>
								<hr />
							</div>
							<ul className="space-y-2">
								<li>Scores</li>
								<li> Favourites (0)</li>
								<li> News </li>
							</ul>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<p className="font-semibold text-lg">Betting Tips</p>
								<hr />
							</div>
							<ul className="space-y-2">
								<li>Value Bets</li>
								<li> Trends</li>
								<li> Streaks </li>
								<li> Daily Acca </li>
							</ul>
						</div>
						<p>My Teams</p>
						<p>My Leagues</p>
					</div>
				</aside>
			</div>
		</div>
	);
}
