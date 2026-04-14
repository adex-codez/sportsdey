import { z } from "@hono/zod-openapi";

export const FundWalletSchema = z.object({
	amount: z.number().min(100).max(9_999_999).openapi({
		description:
			"Amount to fund wallet in Naira (minimum 100, maximum 9,999,999.00)",
		example: 1000,
	}),
});

export const WalletResponseSchema = z.object({
	id: z.string().openapi({ description: "Wallet ID" }),
	balance: z.number().openapi({ description: "Wallet balance in Naira" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
	updatedAt: z.string().openapi({ description: "Last update timestamp" }),
});

export const TransactionResponseSchema = z.object({
	id: z.string().openapi({ description: "Transaction ID" }),
	userId: z.string().openapi({ description: "User ID" }),
	amount: z.number().openapi({ description: "Transaction amount in Naira" }),
	type: z.string().openapi({ description: "Transaction type (credit/debit)" }),
	reference: z.string().openapi({ description: "Transaction reference" }),
	status: z.string().openapi({ description: "Transaction status" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
});

export const FundWalletErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const FundWalletResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		authorizationUrl: z.string().openapi({
			description: "Paystack authorization URL for payment",
		}),
		reference: z.string().openapi({
			description: "Transaction reference",
		}),
	}),
});

export const GetWalletErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const GetWalletResponseSchema = z.object({
	success: z.literal(true),
	data: WalletResponseSchema,
});

export const GetTransactionsErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const GetTransactionsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(TransactionResponseSchema),
});

export const BankResponseSchema = z.object({
	name: z.string().openapi({ description: "Bank name" }),
	code: z.string().openapi({ description: "Bank code" }),
});

export const GetBanksErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const GetBanksResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(BankResponseSchema),
});

export const CallbackQuerySchema = z.object({
	reference: z.string().optional(),
	trxref: z.string().optional(),
	status: z.string().optional(),
	type: z.enum(["deposit", "withdraw"]).optional(),
});

export const WebhookErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const WebhookResponseSchema = z.object({
	received: z.literal(true),
});

export const WithdrawSchema = z.object({
	amount: z.number().min(100).openapi({
		description: "Amount to withdraw in Naira (minimum 100)",
		example: 1000,
	}),
	bankCode: z.string().openapi({
		description: "Bank code (e.g., 058 for GTBank)",
		example: "058",
	}),
	accountNumber: z.string().openapi({
		description: "Bank account number",
		example: "0123456789",
	}),
	accountName: z.string().openapi({
		description: "Account holder name",
		example: "John Doe",
	}),
});

export const WithdrawErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const WithdrawResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		reference: z.string().openapi({
			description: "Withdrawal reference",
		}),
		amount: z.number().openapi({
			description: "Withdrawal amount",
		}),
		status: z.string().openapi({
			description: "Withdrawal status",
		}),
	}),
});

export const WebhookEventSchema = z.object({
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

export type FundWallet = z.infer<typeof FundWalletSchema>;
export type WalletResponse = z.infer<typeof WalletResponseSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
export type Withdraw = z.infer<typeof WithdrawSchema>;

export const CreateWithdrawalAccountSchema = z.object({
	bankCode: z.string().openapi({
		description: "Bank code (e.g., 058 for GTBank)",
		example: "058",
	}),
	bankName: z.string().optional().openapi({
		description: "Bank name (optional - validated via Paystack)",
		example: "Guaranty Trust Bank",
	}),
	accountNumber: z.string().openapi({
		description: "Bank account number",
		example: "0123456789",
	}),
	accountName: z.string().openapi({
		description: "Account holder name (must match Paystack verification)",
		example: "John Doe",
	}),
});

export const WithdrawalAccountResponseSchema = z.object({
	id: z.string().openapi({ description: "Withdrawal account ID" }),
	bankCode: z.string().openapi({ description: "Bank code" }),
	bankName: z.string().openapi({ description: "Bank name" }),
	accountNumber: z.string().openapi({ description: "Account number" }),
	accountName: z.string().openapi({ description: "Account holder name" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
	updatedAt: z.string().openapi({ description: "Last update timestamp" }),
});

export const CreateWithdrawalAccountErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const CreateWithdrawalAccountResponseSchema = z.object({
	success: z.literal(true),
	data: WithdrawalAccountResponseSchema,
});

export const GetWithdrawalAccountsErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

export const GetWithdrawalAccountsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(WithdrawalAccountResponseSchema),
});

export type CreateWithdrawalAccount = z.infer<
	typeof CreateWithdrawalAccountSchema
>;
export type WithdrawalAccountResponse = z.infer<
	typeof WithdrawalAccountResponseSchema
>;
