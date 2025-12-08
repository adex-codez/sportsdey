import { useLocation } from "@tanstack/react-router";
import { SPORTS, type Sport } from "@/lib/constants";

export const useCurrentSport = (): Sport => {
	const location = useLocation();
	const searchParams = location.search as { sports?: string };
	const searchSport = searchParams?.sports;

	const currentSport =
		searchSport === SPORTS.TENNIS || location.pathname.startsWith("/tennis")
			? SPORTS.TENNIS
			: searchSport === SPORTS.BASKETBALL ||
				  location.pathname.startsWith("/basketball")
				? SPORTS.BASKETBALL
				: SPORTS.FOOTBALL;

	return currentSport;
};
