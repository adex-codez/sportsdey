import type { PropsWithChildren } from "react";
import { ActiveTabProvider } from "./active-tab-context";
import { DateContextProvider } from "./date-context";
import { CurrentFilterProvider } from "@/hooks/use-current-filter";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<DateContextProvider>
			<ActiveTabProvider>
				<CurrentFilterProvider>{children}</CurrentFilterProvider>
			</ActiveTabProvider>
		</DateContextProvider>
	);
};
