import { createContext, useContext, useState } from "react";

export type CurrentFilterType = "all" | "live" | "finished" | "upcoming";
type CurrentFilterContextType = {
	currentFilter: CurrentFilterType;
	changeCurrentFilter: (filter: CurrentFilterType) => void;
};

export const CurrentFilterContext = createContext<CurrentFilterContextType>({
	currentFilter: "all",
	changeCurrentFilter: () => {},
});

export const CurrentFilterProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [currentFilter, setCurrentFilter] = useState<CurrentFilterType>("all");

	return (
		<CurrentFilterContext.Provider
			value={{ currentFilter, changeCurrentFilter: setCurrentFilter }}
		>
			{children}
		</CurrentFilterContext.Provider>
	);
};

export const useCurrentFilter = () => {
	const currentFilterContext = useContext(CurrentFilterContext);
	if (!currentFilterContext) {
		throw new Error(
			"useCurrentFilter must be used within a CurrentFilterProvider",
		);
	}

	return currentFilterContext;
};
