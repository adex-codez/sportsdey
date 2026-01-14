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
		<div className="hidden lg:flex w-full overflow-x-auto no-scrollbar pb-2 gap-4">
			{filters.map((filter) => (
				//biome-ignore lint: a11y/useKeyWithClickEvents
				<div
					key={filter.id}
					onClick={() => setCurrentFilter(filter.filter)}
					className={cn(
						"flex h-12 w-max cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 text-xs",
						filter.filter === currentFilter ? "bg-accent text-white" : null,
					)}
				>
					<p>
						{filter.filter.charAt(0).toUpperCase() +
							filter.filter.slice(1)}{" "}
					</p>
					<div
						className={cn(
							"flex size-6 items-center justify-center rounded-full bg-primary text-[9px] text-secondary",
							filter.filter === currentFilter ? "bg-[#456041]" : null,
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
