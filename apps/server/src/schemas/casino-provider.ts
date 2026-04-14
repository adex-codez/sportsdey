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
	currency: z.string().openapi({ description: "Bet currency (currency code)" }),
	provider_tx_id: z
		.string()
		.openapi({ description: "Provider transaction ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
	provider: z.string().openapi({ description: "Provider name" }),
	platform: z
		.string()
		.openapi({ description: "Platform user is playing game on" }),
	action: z.string().openapi({ description: "bet, rain" }),
	action_id: z.string().openapi({
		description: "ID of action in game, which depends on game and action ",
	}),
	game: z.string().openapi({ description: "Game code" }),
});

export const CasinoWithdrawResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		user_id: z.string().openapi({ description: "User ID" }),
		provider: z.string().openapi({ description: "Provider name" }),
		provider_tx_id: z
			.string()
			.openapi({ description: "Provider transaction ID" }),
		old_balance: z
			.number()
			.openapi({ description: "Balance before bet in kobo" }),
		new_balance: z
			.number()
			.openapi({ description: "Balance after bet in kobo" }),
		operator_tx_id: z.string().openapi({
			description: "Operator transaction ID (game transaction ID)",
		}),
		currency: z.string().openapi({ description: "Currency" }),
	}),
});

export const DepositRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	currency: z.string().openapi({ description: "Currency code" }),
	provider_tx_id: z
		.string()
		.openapi({ description: "Provider transaction ID" }),
	session_token: z.string().openapi({ description: "Game session token" }),
	provider: z.string().openapi({ description: "Provider name" }),
	platform: z
		.string()
		.openapi({ description: "Platform user is playing game on" }),
	action: z.string().openapi({ description: "win, rain" }),
	action_id: z.string().openapi({
		description: "ID of action in game, which depends on game and action",
	}),
	game: z.string().openapi({ description: "Game code" }),
});

export const DepositResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		user_id: z.string().openapi({ description: "User ID" }),
		provider_tx_id: z
			.string()
			.openapi({ description: "Provider transaction ID" }),
		operator_tx_id: z.string().openapi({
			description: "Operator transaction ID (game transaction ID)",
		}),
		amount: z.number().openapi({ description: "Win amount in kobo" }),
		old_balance: z
			.number()
			.openapi({ description: "Balance before win in kobo" }),
		new_balance: z
			.number()
			.openapi({ description: "Balance after win in kobo" }),
	}),
});

export const RollbackRequestSchema = z.object({
	user_id: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Amount in kobo" }),
	// currency: z.string().openapi({ description: "Currency code" }),
	rollback_provider_tx_id: z
		.string()
		.openapi({ description: "Transaction ID to rollback" }),
	session_token: z.string().openapi({ description: "Game session token" }),
	provider: z.string().openapi({ description: "Provider name" }),
	// platform: z
	// 	.string()
	// 	.openapi({ description: "Platform user is playing game on" }),
	action: z.string().openapi({ description: "rollback" }),
	action_id: z.string().openapi({
		description: "ID of action in game, which depends on game and action",
	}),
	game: z.string().openapi({ description: "Game code" }),
});

export const RollbackResponseSchema = z.object({
	code: z.number().openapi({ description: "Response code" }),
	data: z.object({
		user_id: z.string().openapi({ description: "User ID" }),
		provider: z.string().openapi({ description: "Provider name" }),
		provider_tx_id: z
			.string()
			.openapi({ description: "Provider transaction ID" }),
		old_balance: z
			.number()
			.openapi({ description: "Balance before rollback in kobo" }),
		new_balance: z
			.number()
			.openapi({ description: "Balance after rollback in kobo" }),
		operator_tx_id: z.string().openapi({
			description: "Operator transaction ID (game transaction ID)",
		}),
		currency: z.string().openapi({ description: "Currency" }),
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
