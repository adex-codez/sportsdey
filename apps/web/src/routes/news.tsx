import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { SPORTS } from "@/lib/constants";

export const Route = createFileRoute("/news")({
	validateSearch: z.object({
		sports: z
			.enum([SPORTS.FOOTBALL, SPORTS.TENNIS, SPORTS.BASKETBALL])
			.optional(),
	}),
	component: () => <Outlet />,
});
