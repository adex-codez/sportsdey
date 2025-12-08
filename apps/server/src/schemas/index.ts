import { z } from "@hono/zod-openapi";

export * from "./basketball";
export * from "./football";
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

export const VideoSchema = z.object({
	videoEmbedUrl: z.string(),
	publishedAt: z.string(),
	title: z.string(),
});

export const VideoResponseSchema = z.object({
	nextPageToken: z.string().optional(),
	prevPageToken: z.string().optional(),
	videos: z.array(VideoSchema),
});