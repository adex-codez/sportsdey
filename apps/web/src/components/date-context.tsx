import {
	createContext,
	type PropsWithChildren,
	useContext,
	useState,
} from "react";

type DateContextType = {
	date: Date;
	setDate: (date: Date) => void;
};

const DateContext = createContext<DateContextType | null>(null);

export const DateContextProvider = ({ children }: PropsWithChildren) => {
	const [date, setDate] = useState<Date>(new Date());
	return (
		<DateContext.Provider value={{ date, setDate }}>
			{children}
		</DateContext.Provider>
	);
};

export const useDateContext = () => {
	const dateContext = useContext(DateContext);
	if (!dateContext) {
		throw new Error("Cannot use date context outside of its provider");
	}
	return dateContext;
};
