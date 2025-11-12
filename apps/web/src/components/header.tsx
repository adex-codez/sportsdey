import { Link } from "@tanstack/react-router";
import {
	ChevronDown,
	ChevronRight,
} from "lucide-react";
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

	return (
			<div className="h-[140px] flex-col md:flex-row md:items-center md:justify-between bg-primary px-4 py-1 text-foreground flex  md:h-[60px] md:px-[104px] w-full overflow-x-hidden">
				<div className="flex justify-center">
					{" "}
					<img
						src="sportsdey-logo.png"
						className="h-10"
						alt="sportsdey's logo"
					/>
				</div>
				<nav className="flex gap-4 overflow-x-auto font-medium text-base py-4">
					{links.map(({ to, label, icon: Icon }) => {
						return (
							<Link key={to} to={to} className="flex gap-2 shrink-0">
								<Icon />
								<p>{label}</p>
							</Link>
						);
					})}
				</nav>
				<div className="md:flex gap-2 hidden ">
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
			</div>
	);
}
