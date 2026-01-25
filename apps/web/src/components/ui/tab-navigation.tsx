interface TabNavigationProps {
	tabs: {
		id: string;
		label: string;
		badge?: number;
	}[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
	className?: string;
}
export const TabNavigation = ({
	tabs,
	activeTab,
	onTabChange,
	className = "",
}: TabNavigationProps) => {
	return (
		<div className={`flex gap-x-1 md:gap-4 ${className}`}>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					onClick={() => onTabChange(tab.id)}
					className={`relative cursor-pointer px-4 py-2 font-normal text-[9px] transition-all md:text-sm ${
						activeTab === tab.id
							? "border-[#1BAA04] border-b-3 text-white"
							: "text-[#909599] hover:text-gray-200"
					}`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};
