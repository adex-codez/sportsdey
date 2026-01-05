import {
	createContext,
	type PropsWithChildren,
	useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setDate as setReduxDate } from "@/store/slices/dateSlice";

type DateContextType = {
	date: Date;
	setDate: (date: Date) => void;
};

const DateContext = createContext<DateContextType | null>(null);

export const DateContextProvider = ({ children }: PropsWithChildren) => {
	const dispatch = useDispatch();
	const selectedDateString = useSelector((state: RootState) => state.date.selectedDate);
	const date = new Date(selectedDateString);

	const setDate = (newDate: Date) => {
		dispatch(setReduxDate(newDate.toISOString()));
	};

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
