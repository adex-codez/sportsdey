import { Accordion } from "radix-ui";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

type Tabs = "scores" | "favourites" | "news";

type ActiveTabContextType = {
	tab: Tabs;
	setTab: (tab: Tabs) => void;
};
const ActiveTabContext = createContext<ActiveTabContextType | undefined>(
	undefined,
);

export const ActiveTabProvider = ({ children }: PropsWithChildren) => {
	const [tab, setTab] = useState<Tabs>("scores");

	return (
		<ActiveTabContext.Provider value={{ tab, setTab }}>
			{children}
		</ActiveTabContext.Provider>
	);
};

export const useActiveTab = () => {
	const activeTabContext = useContext(ActiveTabContext);

	if (!activeTabContext) {
		throw new Error("useActiveTab must be inside ActiveTabProvider");
	}

	return activeTabContext;
};
