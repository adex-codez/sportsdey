import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import {
	ErrorResponseSchema,
	PalmPayBillerSchema,
	PalmPayItemSchema,
	PalmPayOrderSchema,
	successResponseSchema,
} from "@/schemas";
import { createOrder, queryBillers, queryItems } from "@/utils/palmpay";
import { jsonZodErrorFormatter } from "@/utils/zod";
import {
	createOrderQuery,
	queryBillersQuery,
	queryItemsQuery,
} from "@/validators/palmpay";

const palmpayRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

palmpayRoute.openapi(
	createRoute({
		method: "post",
		path: "/biller/query",
		summary: "Query billers",
		description:
			"Get available billers/operators for airtime, data, or betting",
		request: {
			query: queryBillersQuery,
		},
		responses: {
			200: {
				description: "List of available billers",
				content: {
					"application/json": {
						schema: successResponseSchema(z.array(PalmPayBillerSchema)),
					},
				},
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Bad request",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Server error",
			},
		},
		tags: ["PalmPay"],
	}),
	async (c) => {
		const { sceneCode } = c.req.valid("query");
		const apiKey = c.env.PALMPAY_API_KEY;

		if (!apiKey) {
			return c.json(
				{
					success: false as const,
					error: "Configuration error",
					details: [
						{
							field: "PALMPAY_API_KEY",
							message: "PalmPay API key is missing",
							code: "missing_api_key",
						},
					],
				},
				500,
			);
		}

		const result = await queryBillers(apiKey, sceneCode);

		if (!result.ok || !result.data) {
			return c.json(
				{
					success: false as const,
					error: result.error || "Failed to query billers",
					details: null,
				},
				500,
			);
		}

		return c.json(
			{
				success: true as const,
				data: result.data,
			},
			200,
		);
	},
	jsonZodErrorFormatter,
);

palmpayRoute.openapi(
	createRoute({
		method: "post",
		path: "/item/query",
		summary: "Query items",
		description: "Get available packages/items for a specific biller",
		request: {
			query: queryItemsQuery,
		},
		responses: {
			200: {
				description: "List of available items/packages",
				content: {
					"application/json": {
						schema: successResponseSchema(z.array(PalmPayItemSchema)),
					},
				},
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Bad request",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Server error",
			},
		},
		tags: ["PalmPay"],
	}),
	async (c) => {
		const { sceneCode, billerId } = c.req.valid("query");
		const apiKey = c.env.PALMPAY_API_KEY;

		if (!apiKey) {
			return c.json(
				{
					success: false as const,
					error: "Configuration error",
					details: [
						{
							field: "PALMPAY_API_KEY",
							message: "PalmPay API key is missing",
							code: "missing_api_key",
						},
					],
				},
				500,
			);
		}

		const result = await queryItems(apiKey, sceneCode, billerId);

		if (!result.ok || !result.data) {
			return c.json(
				{
					success: false as const,
					error: result.error || "Failed to query items",
					details: null,
				},
				500,
			);
		}

		return c.json(
			{
				success: true as const,
				data: result.data,
			},
			200,
		);
	},
	jsonZodErrorFormatter,
);

palmpayRoute.openapi(
	createRoute({
		method: "post",
		path: "/order/create",
		summary: "Create order",
		description: "Create an order for airtime or data purchase",
		request: {
			query: createOrderQuery,
		},
		responses: {
			200: {
				description: "Order created successfully",
				content: {
					"application/json": {
						schema: successResponseSchema(PalmPayOrderSchema),
					},
				},
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Bad request",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Server error",
			},
		},
		tags: ["PalmPay"],
	}),
	async (c) => {
		const {
			sceneCode,
			outOrderNo,
			amount,
			billerId,
			itemId,
			rechargeAccount,
			title,
			description,
		} = c.req.valid("query");
		const apiKey = c.env.PALMPAY_API_KEY;

		if (!apiKey) {
			return c.json(
				{
					success: false as const,
					error: "Configuration error",
					details: [
						{
							field: "PALMPAY_API_KEY",
							message: "PalmPay API key is missing",
							code: "missing_api_key",
						},
					],
				},
				500,
			);
		}

		const result = await createOrder({
			apiKey,
			sceneCode,
			outOrderNo,
			amount,
			billerId,
			itemId,
			rechargeAccount,
			title,
			description,
		});

		if (!result.ok || !result.data) {
			return c.json(
				{
					success: false as const,
					error: result.error || "Failed to create order",
					details: null,
				},
				500,
			);
		}

		return c.json(
			{
				success: true as const,
				data: result.data,
			},
			200,
		);
	},
	jsonZodErrorFormatter,
);

export default palmpayRoute;
