import { z } from "@hono/zod-openapi";

export const sceneCodeSchema = z.enum(["airtime", "data", "betting"]).openapi({
	description: "Business scenario code",
	example: "airtime",
});

export const queryBillersQuery = z
	.object({
		sceneCode: sceneCodeSchema,
	})
	.openapi({
		description: "Query billers request",
	});

export const queryItemsQuery = z
	.object({
		sceneCode: sceneCodeSchema,
		billerId: z.string().openapi({
			description: "Operator ID",
			example: "MTN",
		}),
	})
	.openapi({
		description: "Query items request",
	});

export const createOrderQuery = z
	.object({
		sceneCode: sceneCodeSchema,
		outOrderNo: z.string().openapi({
			description: "Merchant order number (unique)",
			example: "ORD123456789",
		}),
		amount: z.number().openapi({
			description: "Amount in naira (will be converted to kobo)",
			example: 100,
		}),
		billerId: z.string().openapi({
			description: "Operator ID",
			example: "MTN",
		}),
		itemId: z.string().openapi({
			description: "Package ID",
			example: "5267001812",
		}),
		rechargeAccount: z.string().openapi({
			description: "Phone number to recharge",
			example: "023409551234",
		}),
		title: z.string().optional().openapi({
			description: "Order title",
			example: "Airtime Purchase",
		}),
		description: z.string().optional().openapi({
			description: "Order description",
			example: "MTN airtime top-up",
		}),
	})
	.openapi({
		description: "Create order request",
	});
