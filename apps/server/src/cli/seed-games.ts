import crypto from "node:crypto";

const args = process.argv.slice(2);

let env: "production" | "staging" = "staging";
if (args[0] === "production" || args[0] === "staging") {
	env = args[0];
}

const GAMES = [
	{ name: "Solitaire", code: "solitaire" },
	{ name: "Blocks", code: "blocks" },
	{ name: "Twenty One", code: "twentyone" },
	{ name: "Blackjack", code: "blackjack" },
	{ name: "Slots", code: "slots" },
	{ name: "Plinko", code: "plinko" },
	{ name: "Xcape", code: "XCAPEHB" },
	{ name: "Eagle", code: "EAGLEHB" },
	{ name: "Lucky Rise", code: "LUCKYRISEHB" },
	{ name: "Lagos Rush", code: "LAGOSRUSH" },
];

function escape(value: string | number | null | undefined): string {
	if (value === null || value === undefined) {
		return "NULL";
	}
	return typeof value === "number" ? value.toString() : `'${String(value).replace(/'/g, "''")}'`;
}

function main() {
	const now = Date.now();

	console.log(`Seeding games in ${env} database...`);
	console.log(`Total games: ${GAMES.length}`);

	const values = GAMES.map(
		(game) =>
			`(${escape(crypto.randomUUID())}, ${escape(game.name)}, ${escape(game.code)}, NULL, 1, ${now}, ${now})`,
	).join(", ");

	const sql = `INSERT INTO game (id, name, code, image_url, enabled, created_at, updated_at) VALUES ${values};`;

	const dbName = env === "production" ? "sportsdey_db" : "staging-db";

	console.log(`\nSQL ready to execute on remote ${env} database`);
	console.log("Please run this command manually:");
	console.log(`npx wrangler d1 execute ${dbName} --command "${sql.replace(/"/g, '\\"')}" --remote`);
}

main();