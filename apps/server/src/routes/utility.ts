import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import { createOrder } from "@/utils/palmpay";
import { jsonZodErrorFormatter } from "@/utils/zod";
import type { CloudflareBindings } from "../types";

const utilityRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const PurchaseSchema = z.object({
	sceneCode: z.enum(["airtime", "data"]).openapi({
		description: "Service type",
		example: "airtime",
	}),
	amount: z.number().min(100).openapi({
		description: "Amount in Naira",
		example: 500,
	}),
	billerId: z.string().openapi({
		description: "Operator ID (e.g., MTN, AIRTEL, GLO, 9MOBILE)",
		example: "MTN",
	}),
	itemId: z.string().openapi({
		description: "Package ID",
		example: "5267001812",
	}),
	rechargeAccount: z.string().openapi({
		description: "Phone number to recharge",
		example: "08012345678",
	}),
});

const PurchaseResponseSchema = z.object({
	id: z.string().openapi({ description: "Transaction ID" }),
	userId: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in Naira" }),
	serviceType: z
		.string()
		.openapi({ description: "Service type (airtime/data)" }),
	billerId: z.string().openapi({ description: "Operator ID" }),
	billerName: z.string().openapi({ description: "Operator name" }),
	rechargeAccount: z.string().openapi({ description: "Recharge phone number" }),
	itemId: z.string().openapi({ description: "Package ID" }),
	itemName: z.string().openapi({ description: "Package name" }),
	palmPayOrderNo: z
		.string()
		.nullable()
		.openapi({ description: "PalmPay order number" }),
	outOrderNo: z.string().openapi({ description: "Merchant order number" }),
	status: z.string().openapi({ description: "Transaction status" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
});

const ErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const PurchaseSuccessSchema = z.object({
	success: z.literal(true),
	data: PurchaseResponseSchema,
});

const HistoryQuerySchema = z.object({
	limit: z.number().min(1).max(50).default(20).optional(),
	serviceType: z.enum(["airtime", "data"]).optional(),
});

const HistoryResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(PurchaseResponseSchema),
});

const purchaseRoute = createRoute({
	method: "post",
	path: "/purchase",
	tags: ["Utility"],
	summary: "Purchase airtime or data",
	description: "Purchase airtime or data bundle via PalmPay",
	security: [{ BearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: PurchaseSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Purchase successful",
			content: {
				"application/json": {
					schema: PurchaseSuccessSchema,
				},
			},
		},
		400: {
			description: "Invalid request or purchase failed",
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
		},
	},
});

const historyRoute = createRoute({
	method: "get",
	path: "/history",
	tags: ["Utility"],
	summary: "Get utility purchase history",
	description: "Retrieve user's utility purchase history",
	security: [{ BearerAuth: [] }],
	request: {
		query: HistoryQuerySchema,
	},
	responses: {
		200: {
			description: "History retrieved successfully",
			content: {
				"application/json": {
					schema: HistoryResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized",
			content: {
				"application/json": {
					schema: ErrorSchema,
				},
			},
		},
	},
});

utilityRoute.openapi(purchaseRoute, async (c) => {
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

	const result = PurchaseSchema.safeParse(await c.req.json());
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

	const { sceneCode, amount, billerId, itemId, rechargeAccount } = result.data;
	const apiKey = c.env.PALMPAY_API_KEY;

	if (!apiKey) {
		return c.json(
			{
				success: false as const,
				error: "Configuration error",
				details: null,
			},
			500,
		);
	}

	const db = drizzle(c.env.DB, { schema });

	const outOrderNo = `util_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
	const transactionId = `txnutility_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

	await db.insert(schema.utilityTransaction).values({
		id: transactionId,
		userId: user.id,
		amount,
		serviceType: sceneCode,
		billerId,
		billerName: billerId,
		rechargeAccount,
		itemId,
		itemName: "",
		outOrderNo,
		status: "pending",
	});

	const palmPayResult = await createOrder({
		apiKey,
		sceneCode,
		outOrderNo,
		amount,
		billerId,
		itemId,
		rechargeAccount,
	});

	if (!palmPayResult.ok || !palmPayResult.data) {
		await db
			.update(schema.utilityTransaction)
			.set({ status: "failed" })
			.where(eq(schema.utilityTransaction.id, transactionId));

		return c.json(
			{
				success: false as const,
				error: palmPayResult.error || "Failed to create order",
				details: null,
			},
			400,
		);
	}

	const orderStatus =
		palmPayResult.data.orderStatus === 1
			? "success"
			: palmPayResult.data.orderStatus === 2
				? "failed"
				: "pending";

	await db
		.update(schema.utilityTransaction)
		.set({
			palmPayOrderNo: palmPayResult.data.orderNo,
			status: orderStatus,
			itemName: palmPayResult.data.msg || "",
		})
		.where(eq(schema.utilityTransaction.id, transactionId));

	const [transaction] = await db
		.select()
		.from(schema.utilityTransaction)
		.where(eq(schema.utilityTransaction.id, transactionId))
		.limit(1);

	return c.json(
		{
			success: true as const,
			data: transaction,
		},
		200,
	);
});

utilityRoute.openapi(historyRoute, async (c) => {
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

	const { limit, serviceType } = c.req.valid("query");
	const db = drizzle(c.env.DB, { schema });

	let query = db
		.select()
		.from(schema.utilityTransaction)
		.where(eq(schema.utilityTransaction.userId, user.id));

	if (serviceType) {
		query = query.where(eq(schema.utilityTransaction.serviceType, serviceType));
	}

	const transactions = await query
		.orderBy(desc(schema.utilityTransaction.createdAt))
		.limit(limit || 20);

	return c.json(
		{
			success: true as const,
			data: transactions,
		},
		200,
	);
});

export default utilityRoute;
