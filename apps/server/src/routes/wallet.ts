import { OpenAPIHono } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import { initializeTransaction } from "@/utils/paystack";
import type { CloudflareBindings } from "../types";

const walletRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const FundWalletSchema = z.object({
	amount: z.number().min(1),
});

walletRoute.post("/fund", async (c) => {
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

walletRoute.get("/", async (c) => {
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

walletRoute.get("/transactions", async (c) => {
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

walletRoute.post("/webhook", async (c) => {
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
