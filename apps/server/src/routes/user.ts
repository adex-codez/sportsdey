import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import * as schema from "@/db/schema";
import type { CloudflareBindings } from "../types";

const userRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const UpdateUserSchema = z.object({
	name: z.string().min(1).openapi({
		description: "User's full name",
		example: "John Doe",
	}),
	country: z.string().optional().openapi({
		description: "User's country",
		example: "Nigeria",
	}),
	mobileNumber: z.string().optional().openapi({
		description: "User's mobile number",
		example: "+2348012345678",
	}),
});

const UserResponseSchema = z.object({
	id: z.string().openapi({ description: "User ID" }),
	name: z.string().openapi({ description: "User's name" }),
	email: z.string().openapi({ description: "User's email" }),
	emailVerified: z
		.boolean()
		.openapi({ description: "Email verification status" }),
	image: z
		.string()
		.nullable()
		.openapi({ description: "User's profile image URL" }),
	country: z.string().nullable().openapi({ description: "User's country" }),
	mobileNumber: z
		.string()
		.nullable()
		.openapi({ description: "User's mobile number" }),
	createdAt: z.string().openapi({ description: "Creation timestamp" }),
	updatedAt: z.string().openapi({ description: "Last update timestamp" }),
});

const UpdateUserErrorSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.null(),
});

const UpdateUserResponseSchema = z.object({
	success: z.literal(true),
	data: UserResponseSchema,
});

const getUserRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["User"],
	summary: "Get current user",
	description: "Retrieve the authenticated user's profile details",
	security: [{ BearerAuth: [] }],
	responses: {
		200: {
			description: "User retrieved successfully",
			content: {
				"application/json": {
					schema: UpdateUserResponseSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: UpdateUserErrorSchema,
				},
			},
		},
	},
});

const updateUserRoute = createRoute({
	method: "patch",
	path: "/",
	tags: ["User"],
	summary: "Update user profile",
	description: "Update the authenticated user's profile information",
	security: [{ BearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: UpdateUserSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "User updated successfully",
			content: {
				"application/json": {
					schema: UpdateUserResponseSchema,
				},
			},
		},
		400: {
			description: "Invalid request",
			content: {
				"application/json": {
					schema: UpdateUserErrorSchema,
				},
			},
		},
		401: {
			description: "Unauthorized - user not authenticated",
			content: {
				"application/json": {
					schema: UpdateUserErrorSchema,
				},
			},
		},
	},
});

userRoute.openapi(getUserRoute, async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{
				success: false as const,
				error: "Unauthorized",
				details: null,
			},
			401,
		);
	}

	const db = drizzle(c.env.DB, { schema });

	const [existingUser] = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, user.id))
		.limit(1);

	if (!existingUser) {
		return c.json(
			{
				success: false as const,
				error: "User not found",
				details: null,
			},
			404,
		);
	}

	const userResponse = {
		id: existingUser.id,
		name: existingUser.name,
		email: existingUser.email,
		emailVerified: existingUser.emailVerified,
		image: existingUser.image,
		country: existingUser.country,
		mobileNumber: existingUser.mobileNumber,
		createdAt: existingUser.createdAt,
		updatedAt: existingUser.updatedAt,
	};

	return c.json(
		{
			success: true as const,
			data: userResponse,
		},
		200,
	);
});

userRoute.openapi(updateUserRoute, async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json(
			{
				success: false as const,
				error: "Unauthorized",
				details: null,
			},
			401,
		);
	}

	const result = UpdateUserSchema.safeParse(await c.req.json());
	if (!result.success) {
		return c.json(
			{
				success: false as const,
				error: "Invalid request",
				details: null,
			},
			400,
		);
	}

	const { name, country, mobileNumber } = result.data;
	const db = drizzle(c.env.DB, { schema });

	const [updatedUser] = await db
		.update(schema.user)
		.set({
			name,
			country: country ?? null,
			mobileNumber: mobileNumber ?? null,
		})
		.where(eq(schema.user.id, user.id))
		.returning();

	const userResponse = {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		emailVerified: updatedUser.emailVerified,
		image: updatedUser.image,
		country: updatedUser.country,
		mobileNumber: updatedUser.mobileNumber,
		createdAt: updatedUser.createdAt,
		updatedAt: updatedUser.updatedAt,
	};

	return c.json(
		{
			success: true as const,
			data: userResponse,
		},
		200,
	);
});

export default userRoute;
