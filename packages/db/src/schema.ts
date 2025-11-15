import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const areas = sqliteTable(
	"areas",
	{
		id: integer({ mode: "number" }).primaryKey(),
		name: text(),
	},
	(table) => [index("area_name_ix").on(table.name)],
);

export const competitions = sqliteTable("competitions", {
	id: integer({ mode: "number" }).primaryKey(),
	areaId: integer({ mode: "number" }).references(() => areas.id),
	name: text(),
});
