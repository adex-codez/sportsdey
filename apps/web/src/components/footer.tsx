import { cn } from "@/lib/utils";
import Bet from "@/logos/bet.svg?react";
import News from "@/logos/news.svg?react";
import Score from "@/logos/score.svg?react";
import { type Tabs, useActiveTab } from "./active-tab-context";
import { useCurrentSport } from "@/hooks/use-current-sport";
import { useRouter } from "@tanstack/react-router";

const bottomBarItems: { id: number; item: Tabs; icon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> }[] = [
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
	// {
	// 	id: 5,
	// 	item: "lives",
	// 	icon: Lives,
	// },
];
const Footer = () => {
	const currentSport = useCurrentSport();
	const { tab, setTab } = useActiveTab();
	const router = useRouter();
	return (
		<div className="sticky bottom-0 z-20 left-0 flex w-full justify-between rounded-t-3xl bg-primary px-8 py-4 lg:hidden">
			{bottomBarItems.map(({ id, icon: Icon, item }) => (
				<div
					key={id}
					onClick={() => {
						setTab(item);
						if (item === "scores") {
							router.navigate({
								to:
									currentSport === "tennis"
										? "/tennis"
										: currentSport === "basketball"
											? "/basketball"
											: "/",
								search: { league: undefined, sports: currentSport } as any,
							});
						}
						if (item === "favourites") {
							router.navigate({
								to: "/favorites",
								search: { sports: currentSport },
							});
						}
						if (item === "news") {
							router.navigate({
								to: "/news",
								search: { sports: currentSport },
							});
						}
						if (item === "betting") {
							router.navigate({ to: "/betting", search: {} as any });
						}
						// if(item === "lives") {
						// 		router.navigate({ to: "/lives" });
						// }
					}}
					className={cn(
						"flex flex-col items-center space-y-2",
						tab === item ? "text-accent" : "text-secondary",
					)}
				>
					<Icon
						color={tab === item ? "#1baa04" : "#ececec"}
						fill={tab === item ? "#1baa04" : "#ececec"}
					/>
					<p
						className={cn(
							"text-secondary",
							tab === item ? "text-accent" : "text-secondary",
						)}
					>
						{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
					</p>
				</div>
			))}
		</div>
	);
};

export default Footer;
