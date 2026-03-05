import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import {
	createTransferRecipient,
	getNigerianBanks,
	initializeTransaction,
	initiateTransfer,
	verifyTransaction,
	verifyAccountNumber,
} from "@/utils/paystack";
import type { CloudflareBindings } from "../types";

const walletRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const FundWalletSchema = z.object({
	amount: z.number().min(100).max(9_999_999).openapi({
		description:
			"Amount to fund wallet in Naira (minimum 100, maximum 9,999,999.00)",
		example: 1000,
	}),
});

const WalletResponseSchema = z.object({
	id: z.string().openapi({ description: "Wallet ID" }),
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

const BankResponseSchema = z.object({
	name: z.string().openapi({ description: "Bank name" }),
	code: z.string().openapi({ description: "Bank code" }),
});

const GetBanksErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const GetBanksResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(BankResponseSchema),
});

const CallbackQuerySchema = z.object({
	reference: z.string().optional(),
	trxref: z.string().optional(),
	status: z.string().optional(),
	type: z.enum(["deposit", "withdraw"]).optional(),
});

const WebhookErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const WebhookResponseSchema = z.object({
	received: z.literal(true),
});

const WithdrawSchema = z.object({
	amount: z.number().min(100).openapi({
		description: "Amount to withdraw in Naira (minimum 100)",
		example: 1000,
	}),
	bankCode: z.string().openapi({
		description: "Bank code (e.g., 058 for GTBank)",
		example: "058",
	}),
	accountNumber: z.string().openapi({
		description: "Bank account number",
		example: "0123456789",
	}),
	accountName: z.string().openapi({
		description: "Account holder name",
		example: "John Doe",
	}),
});

const WithdrawErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const WithdrawResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		reference: z.string().openapi({
			description: "Withdrawal reference",
		}),
		amount: z.number().openapi({
			description: "Withdrawal amount",
		}),
		status: z.string().openapi({
			description: "Withdrawal status",
		}),
	}),
});

const fundWalletRoute = createRoute({
	method: "post",
	path: "/fund",
	tags: ["Wallet"],
	summary: "Fund wallet",
	description: "Initialize a wallet funding transaction via Paystack",
	security: [{ BearerAuth: [] }],
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

const getBanksRoute = createRoute({
	method: "get",
	path: "/banks",
	tags: ["Wallet"],
	summary: "Get Nigerian banks",
	description:
		"Retrieve supported Nigerian banks and bank codes for wallet withdrawals",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			description: "Banks retrieved successfully",
			content: {
				"application/json": {
					schema: GetBanksResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: GetBanksErrorSchema,
				},
			},
		},
		400: {
			description: "Failed to fetch banks",
			content: {
				"application/json": {
					schema: GetBanksErrorSchema,
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

const callbackRoute = createRoute({
	method: "get",
	path: "/callback",
	tags: ["Wallet"],
	summary: "Paystack callback redirect",
	description:
		"Handles Paystack callback query params and redirects to wallet transaction status page.",
	request: {
		query: CallbackQuerySchema,
	},
	responses: {
		302: {
			description: "Redirect to wallet status page",
		},
	},
});

const withdrawRoute = createRoute({
	method: "post",
	path: "/withdraw",
	tags: ["Wallet"],
	summary: "Withdraw from wallet",
	description: "Withdraw funds from wallet to user's bank account via Paystack",
	security: [{ BearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: WithdrawSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Withdrawal initiated successfully",
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
					schema: WithdrawErrorSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: WithdrawErrorSchema,
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
		const callbackUrl = `${new URL(c.req.url).origin}/wallet/callback?type=deposit`;
		const paystackResult = await initializeTransaction(
			c.env.PAYSTACK_SECRET_KEY,
			amount,
			user.email,
			{
				userId: user.id,
				reference,
				type: "wallet_funding",
			},
			callbackUrl,
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

		const walletResponse = {
			id: newWallet.id,
			balance: newWallet.balance,
			createdAt: newWallet.createdAt,
			updatedAt: newWallet.updatedAt,
		};

		return c.json(
			{
				success: true as const,
				data: walletResponse,
			},
			200,
		);
	}

	const walletResponse = {
		id: wallet.id,
		balance: wallet.balance,
		createdAt: wallet.createdAt,
		updatedAt: wallet.updatedAt,
	};

	return c.json(
		{
			success: true as const,
			data: walletResponse,
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

walletRoute.openapi(getBanksRoute, async (c) => {
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

	try {
		const banks = await getNigerianBanks(c.env.PAYSTACK_SECRET_KEY);
		const normalizedBanks = banks
			.map((bank) => ({ name: bank.name, code: bank.code }))
			.sort((a, b) => a.name.localeCompare(b.name));

		return c.json(
			{
				success: true as const,
				data: normalizedBanks,
			},
			200,
		);
	} catch (error) {
		return c.json(
			{
				success: false as const,
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch banks",
				details: null,
			},
			400,
		);
	}
});

walletRoute.openapi(callbackRoute, async (c) => {
	const query = c.req.valid("query");
	const reference = query.reference || query.trxref || "";
	const type = query.type || "deposit";
	let status = (query.status || "").toLowerCase();

	// Paystack may not include status in callback query, so verify by reference.
	if (!status && reference) {
		try {
			const tx = await verifyTransaction(c.env.PAYSTACK_SECRET_KEY, reference);
			const txStatus = tx.status.toLowerCase();
			status =
				txStatus === "success"
					? "success"
					: txStatus === "failed" || txStatus === "abandoned"
						? "failed"
						: "pending";
		} catch {
			status = "pending";
		}
	}

	if (!["success", "failed", "pending"].includes(status)) {
		status = "pending";
	}

	const redirectUrl = new URL("/wallet-transaction-status", c.env.CORS_ORIGIN);
	redirectUrl.searchParams.set("status", status);
	redirectUrl.searchParams.set("type", type);
	if (reference) {
		redirectUrl.searchParams.set("reference", reference);
	}

	return c.redirect(redirectUrl.toString(), 302);
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

walletRoute.openapi(withdrawRoute, async (c) => {
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

	const result = WithdrawSchema.safeParse(await c.req.json());
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

	const { amount, bankCode, accountNumber, accountName } = result.data;
	const db = drizzle(c.env.DB, { schema });

	const [wallet] = await db
		.select()
		.from(schema.wallet)
		.where(eq(schema.wallet.userId, user.id))
		.limit(1);

	if (!wallet || wallet.balance < amount) {
		return c.json(
			{
				success: false as const,
				error: "Insufficient balance",
				details: null,
			},
			400,
		);
	}

	const reference = `wd_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

	try {
		const accountVerification = await verifyAccountNumber(
			c.env.PAYSTACK_SECRET_KEY,
			accountNumber,
			bankCode,
		);

		if (!accountVerification.isValid) {
			return c.json(
				{
					success: false as const,
					error: "Invalid account number or bank code",
					details: null,
				},
				400,
			);
		}

		const recipient = await createTransferRecipient(
			c.env.PAYSTACK_SECRET_KEY,
			"bank",
			bankCode,
			accountNumber,
			accountVerification.accountName,
		);

		const transfer = await initiateTransfer(
			c.env.PAYSTACK_SECRET_KEY,
			amount,
			recipient.id,
			"balance",
			"Withdrawal from wallet",
		);

		await db.insert(schema.walletTransaction).values({
			id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
			userId: user.id,
			amount,
			type: "debit",
			reference,
			status: transfer.status === "success" ? "success" : "pending",
		});

		await db
			.update(schema.wallet)
			.set({
				balance: wallet.balance - amount,
			})
			.where(eq(schema.wallet.userId, user.id));

		return c.json(
			{
				success: true as const,
				data: {
					reference: transfer.reference,
					amount,
					status: transfer.status,
				},
			},
			200,
		);
	} catch (error) {
		return c.json(
			{
				success: false as const,
				error:
					error instanceof Error
						? error.message
						: "Failed to process withdrawal",
				details: null,
			},
			400,
		);
	}
});

export default walletRoute;
