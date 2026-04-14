import { z } from "@hono/zod-openapi";

export const MinigodLauncherResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		gameUrl: z
			.string()
			.openapi({ description: "URL to launch the Minigod game" }),
	}),
});

export const LagosRushBalanceRequestSchema = z.object({
	playerId: z.string().openapi({ description: "User ID" }),
	currency: z.string().openapi({ description: "Currency code" }),
});

export const LagosRushBalanceResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		balance: z.number().openapi({ description: "Balance in kobo" }),
		currency: z.string().openapi({ description: "Currency code" }),
	}),
});

export const LagosRushDebitRequestSchema = z.object({
	playerId: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	currency: z.string().openapi({ description: "Currency code" }),
});

export const LagosRushDebitResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		oldBalance: z.number().openapi({ description: "Previous balance in kobo" }),
		newBalance: z.number().openapi({ description: "New balance in kobo" }),
		currency: z.string().openapi({ description: "Currency code" }),
		transactionId: z.string().openapi({ description: "Transaction ID" }),
	}),
});

export const LagosRushCreditRequestSchema = z.object({
	playerId: z.string().openapi({ description: "Player ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	currency: z.string().openapi({ description: "Currency code" }),
});

export const LagosRushCreditResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		oldBalance: z.number().openapi({ description: "Previous balance in kobo" }),
		newBalance: z.number().openapi({ description: "New balance in kobo" }),
		currency: z.string().openapi({ description: "Currency code" }),
		transactionId: z.string().openapi({ description: "Transaction ID" }),
	}),
});

export const LagosRushRefundRequestSchema = z.object({
	playerId: z.string().openapi({ description: "Player ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	currency: z.string().openapi({ description: "Currency code" }),
});

export const LagosRushRefundResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		oldBalance: z.number().openapi({ description: "Previous balance in kobo" }),
		newBalance: z.number().openapi({ description: "New balance in kobo" }),
		currency: z.string().openapi({ description: "Currency code" }),
		transactionId: z.string().openapi({ description: "Transaction ID" }),
	}),
});

export const MinigodErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
});
