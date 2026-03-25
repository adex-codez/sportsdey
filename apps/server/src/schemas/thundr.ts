import { z } from "@hono/zod-openapi";

export const ThundrGameIdSchema = z
	.enum(["solitaire", "blocks", "twentyone", "blackjack", "slots", "plinko"])
	.openapi({ description: "Thundr game identifier" });

export const ThundrPlayRequestSchema = z.object({
	gameId: ThundrGameIdSchema.openapi({ param: { name: "gameId", in: "path" } }),
});

export const ThundrPlayResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		launchUrl: z
			.string()
			.openapi({ description: "URL to launch the Thundr game" }),
		// sessionId: z.string().openapi({ description: "Unique session ID" }),
	}),
});

export const ThundrErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
});

export const ThundrSessionRequestSchema = z.object({
	sessionToken: z.string().openapi({ param: { name: "sessionToken" } }),
});

export const ThundrSessionResponseSchema = z.object({
	userId: z.string(),
	displayName: z.string(),
	sessionId: z.string(),
	currency: z.string(),
});

export const ThundrSessionErrorResponseSchema = z.object({
	errors: z.array(
		z.object({
			code: z.literal("SESSION_EXPIRED"),
			isClientSafe: z.literal(true),
		}),
	),
});

export const ThundrInsufficientBalanceErrorSchema = z.object({
	errors: z.array(
		z.object({
			code: z.literal("INSUFFICIENT_BALANCE"),
			isClientSafe: z.literal(true),
		}),
	),
});

export const ThundrTransactionErrorSchema = z.discriminatedUnion("code", [
	z.object({
		code: z.literal("INSUFFICIENT_BALANCE"),
		isClientSafe: z.literal(true),
	}),
	z.object({
		code: z.literal("SESSION_EXPIRED"),
		isClientSafe: z.literal(true),
	}),
	z.object({
		code: z.literal("INVALID_SIGNATURE"),
		isClientSafe: z.literal(true),
	}),
]);

export const ThundrTransactionErrorResponseSchema = z.object({
	errors: z.array(ThundrTransactionErrorSchema),
});

const ThundrTransactionBaseSchema = z.object({
	type: z.enum(["BET", "WIN", "LOSE", "DRAW", "ROLLBACK"]),
	transactionId: z.string(),
	requestedAt: z.string().datetime(),
	userId: z.string(),
	sessionId: z.string(),
	roundId: z.string(),
	currency: z.string(),
	gameId: ThundrGameIdSchema,
});

export const ThundrBetTransactionSchema = ThundrTransactionBaseSchema.extend({
	type: z.literal("BET"),
	amount: z.number(),
	reward: z.number().optional(),
	serviceFee: z.number().optional(),
});

export const ThundrWinTransactionSchema = ThundrTransactionBaseSchema.extend({
	type: z.literal("WIN"),
	amount: z.number(),
	roomId: z.string().optional(),
});

export const ThundrLoseTransactionSchema = ThundrTransactionBaseSchema.extend({
	type: z.literal("LOSE"),
	roomId: z.string().optional(),
});

export const ThundrDrawTransactionSchema = ThundrTransactionBaseSchema.extend({
	type: z.literal("DRAW"),
	amount: z.number(),
	roomId: z.string().optional(),
});

export const ThundrRollbackTransactionSchema =
	ThundrTransactionBaseSchema.extend({
		type: z.literal("ROLLBACK"),
		originalTransactionId: z.string(),
	});

export const ThundrTransactionRequestSchema = z.discriminatedUnion("type", [
	ThundrBetTransactionSchema,
	ThundrWinTransactionSchema,
	ThundrLoseTransactionSchema,
	ThundrDrawTransactionSchema,
	ThundrRollbackTransactionSchema,
]);

export const ThundrTransactionResponseSchema = z.object({
	transactionId: z.string(),
	userId: z.string(),
	currency: z.string(),
	amount: z.number(),
	type: z.enum(["BET", "WIN", "LOSE", "DRAW", "ROLLBACK"]),
});

export const ThundrBalanceRequestSchema = z.object({
	userId: z.string().openapi({ param: { name: "userId", in: "path" } }),
});

export const ThundrBalanceQuerySchema = z.object({
	sessionId: z.string(),
	currency: z.string(),
});

export const ThundrBalanceResponseSchema = z.object({
	balance: z.number(),
});
