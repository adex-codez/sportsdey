import { type FiltersType, filters } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Filters = ({
	currentFilter,
	setCurrentFilter,
}: {
	currentFilter: FiltersType;
	setCurrentFilter: (val: string) => void;
}) => {
	return (
		<div className="flex flex-wrap justify-center gap-4">
			{filters.map((filter) => (
				//biome-ignore lint: a11y/useKeyWithClickEvents
				<div
					key={filter.id}
					onClick={() => setCurrentFilter(filter.filter)}
					className={cn(
						"flex cursor-pointer items-center gap-2 rounded-2xl bg-white p-2 md:px-4 md:py-2",
						filter.filter === currentFilter ? "bg-accent text-white" : null,
					)}
				>
					<p>
						{filter.filter.charAt(0).toUpperCase() +
							filter.filter.slice(1)}{" "}
					</p>
					<div
						className={cn(
							"flex size-8 items-center justify-center rounded-full bg-primary text-secondary text-sm",
							filter.filter === currentFilter ? "bg-[#456041]" : null,
						)}
					>
						0
					</div>
				</div>
			))}
		</div>
	);
};
