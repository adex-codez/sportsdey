import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import type { CloudflareBindings } from "../types";

const casinoProviderRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const AuthRequestSchema = z.object({
	user_token: z
		.string()
		.openapi({ description: "Launch token from game launch" }),
	session_token: z.string().openapi({ description: "Provider session token" }),
	platform: z
		.string()
		.optional()
		.openapi({ description: "Platform (desktop/mobile)" }),
	currency: z
		.string()
		.optional()
		.default("NGN")
		.openapi({ description: "Currency" }),
});

const AuthResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		user_id: z.string().openapi({ description: "User ID" }),
		username: z.string().openapi({ description: "Username" }),
		balance: z.number().openapi({ description: "Balance in kobo" }),
		currency: z.string().openapi({ description: "Currency" }),
	}),
});

const WithdrawRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	provider_tx_id: z
		.string()
		.openapi({ description: "Provider transaction ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
	game: z.string().openapi({ description: "Game code" }),
});

const WithdrawResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

const DepositRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	provider_tx_id: z
		.string()
		.openapi({ description: "Provider transaction ID" }),
	withdraw_provider_tx_id: z
		.string()
		.optional()
		.openapi({ description: "Associated bet transaction ID" }),
});

const DepositResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

const RollbackRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	rollback_provider_tx_id: z
		.string()
		.openapi({ description: "Transaction ID to rollback" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
});

const RollbackResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

const PlayerInfoRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
});

const PlayerInfoResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Balance in kobo" }),
		currency: z.string().openapi({ description: "Currency" }),
	}),
});

const ErrorResponseSchema = z.object({
	code: z.number(),
	error: z.string(),
});

const authRoute = createRoute({
	method: "post",
	path: "/auth",
	tags: ["Casino Provider"],
	summary: "Authenticate player",
	description: "Validate launch token and create game session",
	request: {
		body: {
			content: {
				"application/json": {
					schema: AuthRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Authentication successful",
			content: {
				"application/json": {
					schema: AuthResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

const withdrawRoute = createRoute({
	method: "post",
	path: "/withdraw_spribe",
	tags: ["Casino Provider"],
	summary: "Process bet",
	description: "Deduct bet amount from user wallet",
	request: {
		body: {
			content: {
				"application/json": {
					schema: WithdrawRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Bet processed",
			content: {
				"application/json": {
					schema: WithdrawResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request or insufficient balance",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

const depositRoute = createRoute({
	method: "post",
	path: "/deposit_spribe",
	tags: ["Casino Provider"],
	summary: "Process win",
	description: "Credit win amount to user wallet",
	request: {
		body: {
			content: {
				"application/json": {
					schema: DepositRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Win processed",
			content: {
				"application/json": {
					schema: DepositResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

const rollbackRoute = createRoute({
	method: "post",
	path: "/rollback_spribe",
	tags: ["Casino Provider"],
	summary: "Rollback transaction",
	description: "Reverse a previous transaction",
	request: {
		body: {
			content: {
				"application/json": {
					schema: RollbackRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Rollback processed",
			content: {
				"application/json": {
					schema: RollbackResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

const playerInfoRoute = createRoute({
	method: "post",
	path: "/player_info",
	tags: ["Casino Provider"],
	summary: "Get player balance",
	description: "Return current player balance",
	request: {
		body: {
			content: {
				"application/json": {
					schema: PlayerInfoRequestSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Balance retrieved",
			content: {
				"application/json": {
					schema: PlayerInfoResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request",
			content: {
				"application/json": {
					schema: ErrorResponseSchema,
				},
			},
		},
	},
});

casinoProviderRoute.openapi(authRoute, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const result = AuthRequestSchema.safeParse(body);

	if (!result.success) {
		return c.json(
			{
				code: 400,
				error: "Invalid request",
			},
			400,
		);
	}

	const { user_token, session_token, currency } = result.data;

	const [launchToken] = await db
		.select()
		.from(schema.gameLaunchTokens)
		.where(
			and(
				eq(schema.gameLaunchTokens.token, user_token),
				eq(schema.gameLaunchTokens.used, false),
			),
		)
		.limit(1);

	if (!launchToken) {
		return c.json(
			{
				code: 400,
				error: "Invalid or expired token",
			},
			400,
		);
	}

	const [user] = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, launchToken.userId))
		.limit(1);

	if (!user) {
		return c.json(
			{
				code: 400,
				error: "User not found",
			},
			400,
		);
	}

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user.id))
		.limit(1);

	const balance = wallet?.balance ?? 0;

	await db.insert(schema.gameSessions).values({
		sessionToken: session_token,
		userId: user.id,
		game: launchToken.game,
		status: "active",
	});

	await db
		.update(schema.gameLaunchTokens)
		.set({ used: true })
		.where(eq(schema.gameLaunchTokens.token, user_token));

	return c.json(
		{
			code: 200,
			data: {
				user_id: user.id,
				username: user.name ?? user.email.split("@")[0],
				balance,
				currency: currency ?? "NGN",
			},
		},
		200,
	);
});

casinoProviderRoute.openapi(withdrawRoute, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const result = WithdrawRequestSchema.safeParse(body);

	if (!result.success) {
		return c.json(
			{
				code: 400,
				error: "Invalid request",
			},
			400,
		);
	}

	const { user_id, amount, provider_tx_id, session_token, game } = result.data;

	const [existingTx] = await db
		.select()
		.from(schema.gameTransactions)
		.where(eq(schema.gameTransactions.providerTxId, provider_tx_id))
		.limit(1);

	if (existingTx) {
		const [wallet] = await db
			.select()
			.from(schema.wallet)
			.where(eq(schema.wallet.userId, user_id))
			.limit(1);

		return c.json(
			{
				code: 200,
				data: {
					balance: wallet?.balance ?? 0,
				},
			},
			200,
		);
	}

	const [session] = await db
		.select()
		.from(schema.gameSessions)
		.where(
			and(
				eq(schema.gameSessions.sessionToken, session_token),
				eq(schema.gameSessions.userId, user_id),
				eq(schema.gameSessions.status, "active"),
			),
		)
		.limit(1);

	if (!session) {
		return c.json(
			{
				code: 400,
				error: "Invalid session",
			},
			400,
		);
	}

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	if (!wallet || wallet.balance < amount) {
		return c.json(
			{
				code: 400,
				error: "Insufficient balance",
			},
			400,
		);
	}

	await db.transaction(async (tx) => {
		await tx
			.update(schema.wallet)
			.set({ balance: wallet.balance - amount })
			.where(eq(schema.wallet.userId, user_id));

		await tx.insert(schema.gameTransactions).values({
			id: `gtxn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
			userId: user_id,
			providerTxId: provider_tx_id,
			type: "BET",
			amount,
			sessionToken: session_token,
			game,
		});
	});

	const [updatedWallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	return c.json(
		{
			code: 200,
			data: {
				balance: updatedWallet?.balance ?? 0,
			},
		},
		200,
	);
});

casinoProviderRoute.openapi(depositRoute, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const result = DepositRequestSchema.safeParse(body);

	if (!result.success) {
		return c.json(
			{
				code: 400,
				error: "Invalid request",
			},
			400,
		);
	}

	const { user_id, amount, provider_tx_id } = result.data;

	const [existingTx] = await db
		.select()
		.from(schema.gameTransactions)
		.where(eq(schema.gameTransactions.providerTxId, provider_tx_id))
		.limit(1);

	if (existingTx) {
		const [wallet] = await db
			.select()
			.from(schema.wallet)
			.where(eq(schema.wallet.userId, user_id))
			.limit(1);

		return c.json(
			{
				code: 200,
				data: {
					balance: wallet?.balance ?? 0,
				},
			},
			200,
		);
	}

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	const currentBalance = wallet?.balance ?? 0;

	await db.transaction(async (tx) => {
		await tx
			.update(schema.wallet)
			.set({ balance: currentBalance + amount })
			.where(eq(schema.wallet.userId, user_id));

		await tx.insert(schema.gameTransactions).values({
			id: `gtxn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
			userId: user_id,
			providerTxId: provider_tx_id,
			type: "WIN",
			amount,
			sessionToken: "",
			game: "",
		});
	});

	const [updatedWallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	return c.json(
		{
			code: 200,
			data: {
				balance: updatedWallet?.balance ?? 0,
			},
		},
		200,
	);
});

casinoProviderRoute.openapi(rollbackRoute, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const result = RollbackRequestSchema.safeParse(body);

	if (!result.success) {
		return c.json(
			{
				code: 400,
				error: "Invalid request",
			},
			400,
		);
	}

	const { user_id, rollback_provider_tx_id, amount } = result.data;

	const [existingTx] = await db
		.select()
		.from(schema.gameTransactions)
		.where(eq(schema.gameTransactions.providerTxId, rollback_provider_tx_id))
		.limit(1);

	if (!existingTx) {
		return c.json(
			{
				code: 400,
				error: "Transaction not found",
			},
			400,
		);
	}

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	const currentBalance = wallet?.balance ?? 0;
	const adjustment = existingTx.type === "BET" ? amount : -amount;

	await db.transaction(async (tx) => {
		await tx
			.update(schema.wallet)
			.set({ balance: currentBalance + adjustment })
			.where(eq(schema.wallet.userId, user_id));

		await tx.insert(schema.gameTransactions).values({
			id: `gtxn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
			userId: user_id,
			providerTxId: `rollback_${rollback_provider_tx_id}`,
			type: "ROLLBACK",
			amount,
			sessionToken: existingTx.sessionToken,
			game: existingTx.game,
		});
	});

	const [updatedWallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	return c.json(
		{
			code: 200,
			data: {
				balance: updatedWallet?.balance ?? 0,
			},
		},
		200,
	);
});

casinoProviderRoute.openapi(playerInfoRoute, async (c) => {
	const db = drizzle(c.env.DB, { schema });
	const body = await c.req.json();
	const result = PlayerInfoRequestSchema.safeParse(body);

	if (!result.success) {
		return c.json(
			{
				code: 400,
				error: "Invalid request",
			},
			400,
		);
	}

	const { user_id, session_token } = result.data;

	const [session] = await db
		.select()
		.from(schema.gameSessions)
		.where(
			and(
				eq(schema.gameSessions.sessionToken, session_token),
				eq(schema.gameSessions.userId, user_id),
				eq(schema.gameSessions.status, "active"),
			),
		)
		.limit(1);

	if (!session) {
		return c.json(
			{
				code: 400,
				error: "Invalid session",
			},
			400,
		);
	}

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user_id))
		.limit(1);

	return c.json(
		{
			code: 200,
			data: {
				balance: wallet?.balance ?? 0,
				currency: "NGN",
			},
		},
		200,
	);
});

export default casinoProviderRoute;
