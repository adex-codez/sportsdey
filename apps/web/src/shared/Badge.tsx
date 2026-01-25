import React from "react";
import { useCurrentFilter } from "@/hooks/use-current-filter";
import { cn } from "@/lib/utils";

interface BadgeProps {
	label: "all" | "live" | "finished" | "upcoming";
	totalNumber: number;
}

const Badge = ({ label, totalNumber }: BadgeProps) => {
	const { currentFilter: activeFilter, changeCurrentFilter } =
		useCurrentFilter();

	const handleFilterChange = () => {
		changeCurrentFilter(label);
	};
	return (
		<button
			onClick={handleFilterChange}
			title="filter"
			type="button"
			className={cn(
				"flex h-12 w-max cursor-pointer items-center justify-center gap-x-2 rounded-2xl px-4 text-xs capitalize",
				activeFilter === label
					? "bg-[#4BA53D] text-white dark:bg-[#4BA53D] dark:text-white"
					: "bg-white text-[#040C01] dark:bg-[#5A5F63] dark:text-white",
			)}
		>
			{label}
			<span
				className={cn(
					"flex h-6 w-6 items-center justify-center rounded-full text-[9px] text-white",
					activeFilter === label
						? "bg-[#456041] dark:bg-[#456041]"
						: "bg-[#040C01] dark:bg-[#040C01]",
				)}
			>
				{totalNumber}
			</span>
		</button>
	);
};

export default Badge;
