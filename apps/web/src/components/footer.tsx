import { cn } from "@/lib/utils";
import Bet from "@/logos/bet.svg?react";
import Lives from "@/logos/live.svg?react";
import News from "@/logos/news.svg?react";
import Score from "@/logos/score.svg?react";
import { useActiveTab } from "./active-tab-context";

const bottomBarItems = [
	{
		id: 1,
		item: "scores",
		icon: Score,
	},
	{
		id: 2,
		item: "favourites",
		icon: Bet,
	},
	{
		id: 3,
		item: "betting",
		icon: Bet,
	},
	{
		id: 4,
		item: "news",
		icon: News,
	},
	{
		id: 5,
		item: "lives",
		icon: Lives,
	},
];
const Footer = () => {
	const { tab } = useActiveTab();
	return (
		<div className="fixed bottom-0 z-20 left-0 flex w-full justify-between rounded-t-3xl bg-primary px-8 py-4 lg:hidden">
			{bottomBarItems.map(({ id, icon: Icon, item }) => (
				<div
					key={id}
					className={cn(
						"flex flex-col items-center space-y-2",
						tab === item ? "text-secondary" : "text-accent",
					)}
				>
					<Icon />
					<p className="text-secondary">
						{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
					</p>
				</div>
			))}
		</div>
	);
};

export default Footer;
