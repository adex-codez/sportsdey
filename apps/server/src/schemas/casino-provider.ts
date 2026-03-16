import { z } from "@hono/zod-openapi";

export const AuthRequestSchema = z.object({
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

export const AuthResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		user_id: z.string().openapi({ description: "User ID" }),
		username: z.string().openapi({ description: "Username" }),
		balance: z.number().openapi({ description: "Balance in kobo" }),
		currency: z.string().openapi({ description: "Currency" }),
	}),
});

export const WithdrawRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	provider_tx_id: z
		.string()
		.openapi({ description: "Provider transaction ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
	game: z.string().openapi({ description: "Game code" }),
});

export const WithdrawResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

export const DepositRequestSchema = z.object({
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

export const DepositResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

export const RollbackRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	rollback_provider_tx_id: z
		.string()
		.openapi({ description: "Transaction ID to rollback" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
});

export const RollbackResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Updated balance in kobo" }),
	}),
});

export const PlayerInfoRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
});

export const PlayerInfoResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		balance: z.number().openapi({ description: "Balance in kobo" }),
		currency: z.string().openapi({ description: "Currency" }),
	}),
});

export const CasinoProviderErrorSchema = z.object({
	code: z.number(),
	error: z.string(),
});
