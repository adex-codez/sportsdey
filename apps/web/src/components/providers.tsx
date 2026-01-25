import type { PropsWithChildren } from "react";
import { CurrentFilterProvider } from "@/hooks/use-current-filter";
import { ActiveTabProvider } from "./active-tab-context";
import { DateContextProvider } from "./date-context";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<DateContextProvider>
			<ActiveTabProvider>
				<CurrentFilterProvider>{children}</CurrentFilterProvider>
			</ActiveTabProvider>
		</DateContextProvider>
	);
};
