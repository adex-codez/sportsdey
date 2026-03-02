import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import { initializeTransaction } from "@/utils/paystack";
import type { CloudflareBindings } from "../types";

const walletRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const FundWalletSchema = z.object({
	amount: z.number().min(1).openapi({
		description: "Amount to fund wallet in Naira",
		example: 1000,
	}),
});

const WalletResponseSchema = z.object({
	id: z.string().openapi({ description: "Wallet ID" }),
	userId: z.string().openapi({ description: "User ID" }),
	balance: z.number().openapi({ description: "Wallet balance in Naira" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
	updatedAt: z.string().openapi({ description: "Last update timestamp" }),
});

const TransactionResponseSchema = z.object({
	id: z.string().openapi({ description: "Transaction ID" }),
	userId: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Transaction amount in Naira" }),
	type: z.string().openapi({ description: "Transaction type (credit/debit)" }),
	reference: z.string().openapi({ description: "Transaction reference" }),
	status: z.string().openapi({ description: "Transaction status" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
});

const FundWalletErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const FundWalletResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		authorizationUrl: z.string().openapi({
			description: "Paystack authorization URL for payment",
		}),
		reference: z.string().openapi({
			description: "Transaction reference",
		}),
	}),
});

const GetWalletErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const GetWalletResponseSchema = z.object({
	success: z.literal(true),
	data: WalletResponseSchema,
});

const GetTransactionsErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const GetTransactionsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(TransactionResponseSchema),
});

const WebhookErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const WebhookResponseSchema = z.object({
	received: z.literal(true),
});

const fundWalletRoute = createRoute({
	method: "post",
	path: "/fund",
	tags: ["Wallet"],
	summary: "Fund wallet",
	description: "Initialize a wallet funding transaction via Paystack",
	request: {
		body: {
			content: {
				"application/json": {
					schema: FundWalletSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Payment initialized successfully",
			content: {
				"application/json": {
					schema: FundWalletResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request or payment failed",
			content: {
				"application/json": {
					schema: FundWalletErrorSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: FundWalletErrorSchema,
				},
			},
		},
	},
});

const getWalletRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["Wallet"],
	summary: "Get wallet",
	description: "Retrieve the authenticated user's wallet details",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			description: "Wallet retrieved successfully",
			content: {
				"application/json": {
					schema: GetWalletResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: GetWalletErrorSchema,
				},
			},
		},
	},
});

const getTransactionsRoute = createRoute({
	method: "get",
	path: "/transactions",
	tags: ["Wallet"],
	summary: "Get wallet transactions",
	description: "Retrieve the authenticated user's wallet transaction history",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			description: "Transactions retrieved successfully",
			content: {
				"application/json": {
					schema: GetTransactionsResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: GetTransactionsErrorSchema,
				},
			},
		},
	},
});

const webhookRoute = createRoute({
	method: "post",
	path: "/webhook",
	tags: ["Wallet"],
	summary: "Paystack webhook",
	description: "Handle Paystack webhook events for wallet funding",
	security: [{ PaystackSignature: [] }],
	responses: {
		200: {
			description: "Webhook processed",
			content: {
				"application/json": {
					schema: WebhookResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid signature or malformed request",
			content: {
				"application/json": {
					schema: WebhookErrorSchema,
				},
			},
		},
	},
});

walletRoute.openapi(fundWalletRoute, async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{
				success: false as const,
				error: "Unauthorized",
				details: null,
			},
			401,
		);
	}

	const result = FundWalletSchema.safeParse(await c.req.json());
	if (!result.success) {
		return c.json(
			{
				success: false as const,
				error: "Invalid request",
				details: null,
			},
			400,
		);
	}

	const { amount } = result.data;
	const db = drizzle(c.env.DB, { schema });

	const reference = `wf_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

	const [existingWallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user.id))
		.limit(1);

	if (!existingWallet) {
		await db.insert(schema.wallet).values({
			id: `wallet_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
			userId: user.id,
			balance: 0,
		});
	}

	await db.insert(schema.walletTransaction).values({
		id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
		userId: user.id,
		amount,
		type: "credit",
		reference,
		status: "pending",
	});

	try {
		const paystackResult = await initializeTransaction(
			c.env.PAYSTACK_SECRET_KEY,
			amount,
			user.email,
			{
				userId: user.id,
				reference,
				type: "wallet_funding",
			},
		);

		return c.json(
			{
				success: true as const,
				data: {
					authorizationUrl: paystackResult.authorizationUrl,
					reference: paystackResult.reference,
				},
			},
			200,
		);
	} catch (error) {
		await db
			.update(schema.walletTransaction)
			.set({ status: "failed" })
			.where(eq(schema.walletTransaction.reference, reference));

		return c.json(
			{
				success: false as const,
				error:
					error instanceof Error
						? error.message
						: "Failed to initialize payment",
				details: null,
			},
			400,
		);
	}
});

walletRoute.openapi(getWalletRoute, async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{
				success: false as const,
				error: "Unauthorized",
				details: null,
			},
			401,
		);
	}

	const db = drizzle(c.env.DB, { schema });

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user.id))
		.limit(1);

	if (!wallet) {
		const [newWallet] = await db
			.insert(schema.wallet)
			.values({
				id: `wallet_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
				userId: user.id,
				balance: 0,
			})
			.returning();

		return c.json(
			{
				success: true as const,
				data: newWallet,
			},
			200,
		);
	}

	return c.json(
		{
			success: true as const,
			data: wallet,
		},
		200,
	);
});

walletRoute.openapi(getTransactionsRoute, async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{
				success: false as const,
				error: "Unauthorized",
				details: null,
			},
			401,
		);
	}

	const db = drizzle(c.env.DB, { schema });

	const transactions = await db
		.select()
		.from(schema.walletTransaction)
		.where(eq(schema.walletTransaction.userId, user.id))
		.orderBy(desc(schema.walletTransaction.createdAt))
		.limit(50);

	return c.json(
		{
			success: true as const,
			data: transactions,
		},
		200,
	);
});

const WebhookEventSchema = z.object({
	event: z.string(),
	data: z.object({
		reference: z.string(),
		amount: z.number(),
		status: z.string(),
		customer: z.object({
			email: z.string(),
		}),
		metadata: z.record(z.string(), z.unknown()).optional(),
	}),
});

walletRoute.openapi(webhookRoute, async (c) => {
	const signature = c.req.header("x-paystack-signature");
	if (!signature) {
		return c.json(
			{
				success: false as const,
				error: "Missing signature",
				details: null,
			},
			400,
		);
	}

	const rawBody = await c.req.text();
	const crypto = await import("crypto");
	const hash = crypto
		.createHmac("sha512", c.env.PAYSTACK_SECRET_KEY)
		.update(rawBody)
		.digest("hex");

	if (hash !== signature) {
		return c.json(
			{
				success: false as const,
				error: "Invalid signature",
				details: null,
			},
			400,
		);
	}

	const parseResult = WebhookEventSchema.safeParse(JSON.parse(rawBody));
	if (!parseResult.success) {
		return c.json({ received: true }, 200);
	}

	const { event, data } = parseResult.data;

	if (event === "charge.success") {
		const reference = data.reference;
		const db = drizzle(c.env.DB, { schema });

		const [transaction] = await db
			.select()
			.from(schema.walletTransaction)
			.where(eq(schema.walletTransaction.reference, reference))
			.limit(1);

		if (!transaction) {
			return c.json({ received: true }, 200);
		}

		if (transaction.status !== "pending") {
			return c.json({ received: true }, 200);
		}

		await db
			.update(schema.walletTransaction)
			.set({ status: "success" })
			.where(eq(schema.walletTransaction.reference, reference));

		await db
			.update(schema.wallet)
			.set({
				balance: transaction.amount,
			})
			.where(eq(schema.wallet.userId, transaction.userId));
	}

	return c.json({ received: true }, 200);
});

export default walletRoute;
