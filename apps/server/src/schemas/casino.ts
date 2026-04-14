import { z } from "@hono/zod-openapi";

export const GamePlayRequestSchema = z.object({
	gameCode: z.string().openapi({ description: "Game code to play" }),
});

export const GamePlayResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		launchUrl: z.string().openapi({ description: "URL to launch the game" }),
		token: z.string().openapi({ description: "Token for game" }),
	}),
});

export const GamePlayErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
});

export const CasinoTransactionSchema = z.object({
	id: z.string(),
	providerTxId: z.string(),
	type: z.string(),
	amount: z.number(),
	game: z.string(),
	createdAt: z.string(),
});

export const TransactionsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(CasinoTransactionSchema),
});
