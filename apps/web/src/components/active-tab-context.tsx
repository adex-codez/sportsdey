import { useLocation } from "@tanstack/react-router";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
	useEffect,
} from "react";

export type Tabs = "scores" | "favourites" | "news" | "betting";

type ActiveTabContextType = {
	tab: Tabs;
	setTab: (tab: Tabs) => void;
};
const ActiveTabContext = createContext<ActiveTabContextType | undefined>(
	undefined,
);

export const ActiveTabProvider = ({ children }: PropsWithChildren) => {
	const [tab, setTab] = useState<Tabs>("scores");
	const location = useLocation();

	useEffect(() => {
		const path = location.pathname;
		if (path.startsWith("/favorites")) {
			setTab("favourites");
		} else if (path.startsWith("/news")) {
			setTab("news");
		} else if (path.startsWith("/betting")) {
			setTab("betting");
		} else {
			setTab("scores");
		}
	}, [location.pathname]);

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
