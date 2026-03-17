import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import {
	CallbackQuerySchema,
	FundWalletErrorSchema,
	FundWalletResponseSchema,
	FundWalletSchema,
	GetBanksErrorSchema,
	GetBanksResponseSchema,
	GetTransactionsErrorSchema,
	GetTransactionsResponseSchema,
	GetWalletErrorSchema,
	GetWalletResponseSchema,
	TransactionResponseSchema,
	WalletResponseSchema,
	WithdrawResponseSchema as WalletWithdrawResponseSchema,
	WebhookErrorSchema,
	WebhookEventSchema,
	WebhookResponseSchema,
	WithdrawErrorSchema,
	WithdrawSchema,
} from "@/schemas/wallet";
import {
	createTransferRecipient,
	getNigerianBanks,
	initializeTransaction,
	initiateTransfer,
	verifyAccountNumber,
	verifyTransaction,
} from "@/utils/paystack";
import type { CloudflareBindings } from "../types";

const walletRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

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
					schema: WalletWithdrawResponseSchema,
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
		const callbackUrl = `${c.env.SERVER_URL}/wallet/callback?type=deposit`;
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
				error: error instanceof Error ? error.message : "Failed to fetch banks",
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

	let status = "pending";

	if (reference) {
		try {
			const tx = await verifyTransaction(c.env.PAYSTACK_SECRET_KEY, reference);
			const txStatus = tx.status.toLowerCase();
			console.log("transaction status", txStatus);
			status =
				txStatus === "success"
					? "success"
					: txStatus === "failed" || txStatus === "abandoned"
						? "failed"
						: "pending";

			if (status === "success" && type === "deposit") {
				const db = drizzle(c.env.DB, { schema });

				const [transaction] = await db
					.select()
					.from(schema.walletTransaction)
					.where(eq(schema.walletTransaction.reference, reference))
					.limit(1);

				if (transaction && transaction.status !== "success") {
					await db
						.update(schema.walletTransaction)
						.set({ status: "success" })
						.where(eq(schema.walletTransaction.reference, reference));

					console.log(
						"Transaction updated:",
						await db
							.select()
							.from(schema.walletTransaction)
							.where(eq(schema.walletTransaction.reference, reference))
							.limit(1),
					);

					const [wallet] = await db
						.select()
						.from(schema.wallet)
						.where(eq(schema.wallet.userId, transaction.userId))
						.limit(1);

					if (wallet) {
						await db
							.update(schema.wallet)
							.set({
								balance: wallet.balance + transaction.amount,
							})
							.where(eq(schema.wallet.userId, transaction.userId));
					}
				}
			}
		} catch {
			status = "pending";
		}
	}

	const isSuccess = status === "success";
	const isFailed = status === "failed";
	const title =
		type === "withdraw"
			? isSuccess
				? "Withdrawal successful"
				: isFailed
					? "Withdrawal failed"
					: "Withdrawal pending"
			: isSuccess
				? "Deposit successful"
				: isFailed
					? "Deposit failed"
					: "Deposit pending";

	const description = isSuccess
		? "Your transaction was completed successfully."
		: isFailed
			? "This transaction failed. Please try again."
			: "Your transaction is still being processed.";

	const textColor = isSuccess ? "#14804A" : isFailed ? "#D13030" : "#B26A00";
	const bgCircle = isSuccess ? "#14804A" : isFailed ? "#D13030" : "#B26A00";
	const bgPing = isSuccess ? "#CCF3DD" : isFailed ? "#FADBD8" : "#F2CF93";
	const borderColor = isSuccess ? "#F2CF93" : isFailed ? "#FADBD8" : "#F2CF93";

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			background: #fafafa;
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.container {
			background: white;
			border-radius: 16px;
			padding: 32px;
			text-align: center;
			box-shadow: 0 1px 3px rgba(0,0,0,0.1);
			max-width: 400px;
			width: 90%;
		}
		@media (prefers-color-scheme: dark) {
			body { background: #121212; }
			.container { background: #202120; }
		}
		.icon-container {
			display: flex;
			justify-content: center;
			margin-bottom: 24px;
		}
		${
			isSuccess
				? `
			.icon-wrapper {
				position: relative;
				width: 96px;
				height: 96px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.ping {
				position: absolute;
				width: 96px;
				height: 96px;
				background: ${bgPing};
				border-radius: 50%;
				animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
			}
			.circle {
				position: relative;
				width: 80px;
				height: 80px;
				background: ${bgCircle};
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 32px;
			}
			@keyframes ping {
				75%, 100% { transform: scale(2); opacity: 0; }
			}
		`
				: isFailed
					? `
			.circle {
				width: 80px;
				height: 80px;
				background: ${bgCircle};
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 40px;
				animation: pulse 1.5s ease-in-out infinite;
			}
			@keyframes pulse {
				0%, 100% { opacity: 1; }
				50% { opacity: 0.6; }
			}
		`
					: `
			.spinner {
				width: 80px;
				height: 80px;
				border: 4px solid ${borderColor};
				border-top-color: ${bgCircle};
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}
			@keyframes spin {
				to { transform: rotate(360deg); }
			}
		`
		}
		h1 {
			font-size: 24px;
			font-weight: 600;
			color: ${textColor};
			margin-bottom: 12px;
		}
		p {
			color: #6E6E6E;
			font-size: 14px;
			line-height: 1.5;
		}
		.reference {
			margin-top: 8px;
			font-size: 12px;
		}
		.close-msg {
			margin-top: 24px;
			padding-top: 16px;
			border-top: 1px solid #eee;
			font-size: 13px;
			color: #888;
		}
		@media (prefers-color-scheme: dark) {
			p { color: #aaa; }
			.close-msg { border-color: #333; }
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="icon-container">
			${
				isSuccess
					? `
				<div class="icon-wrapper">
					<div class="ping"></div>
					<div class="circle">✓</div>
				</div>
			`
					: isFailed
						? `
				<div class="circle">×</div>
			`
						: `
				<div class="spinner"></div>
			`
			}
		</div>
		<h1>${title}</h1>
		<p>${description}</p>
		${reference ? `<p class="reference">Reference: ${reference}</p>` : ""}
		<p class="close-msg">You can close this window</p>
	</div>
</body>
</html>`;

	return c.html(html, 200);
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

		try {
			const verifiedTx = await verifyTransaction(
				c.env.PAYSTACK_SECRET_KEY,
				reference,
			);

			if (verifiedTx.status.toLowerCase() !== "success") {
				await db
					.update(schema.walletTransaction)
					.set({ status: "failed" })
					.where(eq(schema.walletTransaction.reference, reference));

				return c.json({ received: true }, 200);
			}
		} catch {
			return c.json({ received: true }, 200);
		}

		await db
			.update(schema.walletTransaction)
			.set({ status: "success" })
			.where(eq(schema.walletTransaction.reference, reference));

		const [wallet] = await db
			.select()
			.from(schema.wallet)
			.where(eq(schema.wallet.userId, transaction.userId))
			.limit(1);

		if (wallet) {
			await db
				.update(schema.wallet)
				.set({
					balance: wallet.balance + transaction.amount,
				})
				.where(eq(schema.wallet.userId, transaction.userId));
		}
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
