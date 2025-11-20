export const filters = [
	{
		id: 1,
		filter: "all",
	},
	{
		id: 2,
		filter: "live",
	},
	{
		id: 3,
		filter: "finished",
	},
	{
		id: 4,
		filter: "upcoming",
	},
] satisfies { id: number; filter: string }[];

export type FiltersType = (typeof filters)[number]["filter"];
