import { z } from "@hono/zod-openapi";

export * from "./basketball";
export * from "./tennis";
export const successResponseSchema = <T extends z.ZodType>(data: T) =>
	z.object({
		success: z.literal(true),
		data: data,
	});

export const ErrorDetailSchema = z.object({
	field: z.string(),
	message: z.string(),
	code: z.string(),
});

export const ErrorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.array(ErrorDetailSchema).nullable(),
});
