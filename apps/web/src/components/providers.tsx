import type { PropsWithChildren } from "react";
import { ActiveTabProvider } from "./active-tab-context";
import { DateContextProvider } from "./date-context";

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<DateContextProvider>
			<ActiveTabProvider>{children}</ActiveTabProvider>
		</DateContextProvider>
	);
};
