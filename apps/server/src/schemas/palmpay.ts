import { z } from "@hono/zod-openapi";

export const PalmPayBillerSchema = z.object({
	billerId: z.string(),
	billerName: z.string(),
	billerIcon: z.string(),
	minAmount: z.number().nullable(),
	maxAmount: z.number().nullable(),
	status: z.number(),
});

export const PalmPayItemExtInfoSchema = z.object({
	validityDate: z.number().optional(),
	itemSize: z.string().optional(),
	itemDescription: z.record(z.string(), z.string()).optional(),
});

export const PalmPayItemSchema = z.object({
	billerId: z.string(),
	itemId: z.string(),
	itemName: z.string(),
	amount: z.number().nullable(),
	maxAmount: z.number().nullable(),
	minAmount: z.number().nullable(),
	isFixAmount: z.number(),
	status: z.number(),
	extInfo: PalmPayItemExtInfoSchema.optional(),
});

export const PalmPayOrderSchema = z.object({
	outOrderNo: z.string(),
	orderNo: z.string(),
	orderStatus: z.number(),
	msg: z.string(),
	amount: z.number(),
	sceneCode: z.string(),
});

export type PalmPayBiller = z.infer<typeof PalmPayBillerSchema>;
export type PalmPayItem = z.infer<typeof PalmPayItemSchema>;
export type PalmPayOrder = z.infer<typeof PalmPayOrderSchema>;
