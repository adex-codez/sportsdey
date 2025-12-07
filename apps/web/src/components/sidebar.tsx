import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { useActiveTab } from "./active-tab-context";
import { Button } from "./ui/button";

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
	const [isIframeLoading, setIsIframeLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsIframeLoading(false), 5000);
		return () => clearTimeout(timer);
	}, []);


	return (
		<div className="space-y-8">
			<SidebarItem heading="Menu">
				<ul className="space-y-4 px-6 py-6">
					<li
						className={cn(
							"cursor-pointer",
							tab === "scores" ? "font-semibold text-accent" : null,
						)}
					>
						Scores
					</li>
					<li
						className={cn(
							"cursor-pointer",
							tab === "favourites" ? "font-semibold text-accent" : null,
						)}
					>
						{" "}
						Favourite (0)
					</li>
					<li
						className={cn(
							"cursor-pointer",
							tab === "news" ? "font-semibold text-accent" : null,
						)}
					>
						News
					</li>
				</ul>
			</SidebarItem>

			<div className="relative h-[200px] w-full rounded-2xl bg-white">
				{isIframeLoading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				)}
				<iframe
					src="https://bet.sportsdey.com/?mode=widget"
					title="sportsdey betting tips widget"
					className={cn(
						"h-full w-full cust-scrollbar rounded-2xl transition-opacity duration-500",
						isIframeLoading ? "opacity-0" : "opacity-100",
					)}
					id="sportsIframe"
					onLoad={() => setIsIframeLoading(false)}
				/>
			</div>

			<SidebarItem heading="My Teams" icon={<ChevronRight />}>
				<div>
					<p className="px-6 py-6 text-sm">
						{" "}
						You have no teams selected as favourites. Tap the star icon next to
						a team to add to favourites.
					</p>
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
				<div className="px-6 py-6">
					<p className="text-sm">
						{" "}
						You have no leagues selected as favourites. Tap the star icon in the
						league detail to add to favourites.
					</p>
				</div>
			</SidebarItem>
		</div>
	);
};

export default Sidebar;
