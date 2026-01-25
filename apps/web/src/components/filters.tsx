import { type FiltersType, filters } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Filters = ({
	currentFilter,
	setCurrentFilter,
	filtersCount,
}: {
	currentFilter: FiltersType;
	setCurrentFilter: (val: string) => void;
	filtersCount: {
		allCount: number;
		liveCount: number;
		finishedCount: number;
		upcomingCount: number;
	};
}) => {
	return (
		<div className="no-scrollbar hidden w-full gap-4 overflow-x-auto pb-2 lg:flex">
			{filters.map((filter) => (
				//biome-ignore lint: a11y/useKeyWithClickEvents
				<div
					key={filter.id}
					onClick={() => setCurrentFilter(filter.filter)}
					className={cn(
						"flex h-12 w-max cursor-pointer items-center gap-2 rounded-2xl px-4 text-xs",
						filter.filter === currentFilter
							? "bg-accent text-white dark:bg-accent dark:text-white"
							: "bg-white text-[#040C01] dark:bg-[#202120] dark:text-white",
					)}
				>
					<p>
						{filter.filter.charAt(0).toUpperCase() +
							filter.filter.slice(1)}{" "}
					</p>
					<div
						className={cn(
							"flex size-6 items-center justify-center rounded-full text-[9px] text-secondary",
							filter.filter === currentFilter
								? "bg-[#456041] dark:bg-[#456041]"
								: "bg-primary text-white dark:bg-[#040C01] dark:text-white",
						)}
					>
						{filter.filter === "all"
							? filtersCount.allCount
							: filter.filter === "live"
								? filtersCount.liveCount
								: filter.filter === "finished"
									? filtersCount.finishedCount
									: filtersCount.upcomingCount}
					</div>
				</div>
			))}
		</div>
	);
};
