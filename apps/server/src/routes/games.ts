import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
import { getSessionToken, validateAdminSession } from "@/auth/admin";
import { successResponseSchema, ErrorResponseSchema } from "@/schemas";
import type { CloudflareBindings } from "../types";

const gamesRoute = new OpenAPIHono<{ Bindings: CloudflareBindings }>();

const GameParamsSchema = z.object({
	id: z.string().openapi({ description: "Game ID" }),
});

const CreateGameSchema = z.object({
	name: z.string().min(1).openapi({ description: "Game name" }),
	code: z.string().min(1).openapi({ description: "Short code for provider" }),
	imageUrl: z.string().nullable().optional().openapi({ description: "Image URL (optional)" }),
	enabled: z.boolean().optional().default(true).openapi({ description: "Whether game is enabled" }),
});

const CreateGamesSchema = z
	.array(CreateGameSchema)
	.min(1)
	.max(100);

const UpdateGameSchema = CreateGameSchema.partial();

const EnableDisableResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		id: z.string(),
		enabled: z.boolean(),
	}),
});

const GameResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	imageUrl: z.string().nullable(),
	enabled: z.boolean(),
	createdAt: z.number(),
	updatedAt: z.number(),
});

const GameListResponseSchema = GameResponseSchema.array();

gamesRoute.openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "List all games",
		description: "Returns all games, both enabled and disabled",
		request: {},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successResponseSchema(GameListResponseSchema),
					},
				},
				description: "Successfully retrieved games",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const db = drizzle(c.env.DB, { schema });
		const games = await db.select().from(schema.game).orderBy(schema.game.name);
		return c.json({ success: true as const, data: games }, 200);
	},
);

gamesRoute.openapi(
	createRoute({
		method: "get",
		path: "/:id",
		summary: "Get a single game",
		description: "Returns a game by ID",
		request: {
			params: GameParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successResponseSchema(GameResponseSchema),
					},
				},
				description: "Successfully retrieved game",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Game not found",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const { id } = c.req.valid("param");
		const db = drizzle(c.env.DB, { schema });
		const game = await db.select().from(schema.game).where(eq(schema.game.id, id)).get();

		if (!game) {
			return c.json(
				{ success: false as const, error: "Game not found", details: null },
				404,
			);
		}

		return c.json({ success: true as const, data: game }, 200);
	},
);

gamesRoute.openapi(
	createRoute({
		method: "post",
		path: "/",
		summary: "Create games",
		description: "Create one or multiple games. Requires admin authentication.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: CreateGamesSchema,
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: successResponseSchema(GameListResponseSchema),
					},
				},
				description: "Successfully created games",
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Invalid request body",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Unauthorized",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const token = getSessionToken(c.req.raw.headers);
		if (!token) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const session = await validateAdminSession(c.env, token);
		if (!session) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const body = await c.req.json();
		const result = CreateGamesSchema.safeParse(body);
		if (!result.success) {
			return c.json(
				{ success: false as const, error: "Invalid request body", details: null },
				400,
			);
		}

		const db = drizzle(c.env.DB, { schema });
		const now = Date.now();

		const gamesToInsert = result.data.map((game) => ({
			id: crypto.randomUUID(),
			name: game.name,
			code: game.code,
			imageUrl: game.imageUrl ?? null,
			enabled: game.enabled ?? true,
			createdAt: now,
			updatedAt: now,
		}));

		const inserted = await db.insert(schema.game).values(gamesToInsert).returning();

		return c.json({ success: true as const, data: inserted }, 201);
	},
);

gamesRoute.openapi(
	createRoute({
		method: "patch",
		path: "/:id",
		summary: "Update a game",
		description: "Update a game by ID. Requires admin authentication.",
		request: {
			params: GameParamsSchema,
			body: {
				content: {
					"application/json": {
						schema: UpdateGameSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successResponseSchema(GameResponseSchema),
					},
				},
				description: "Successfully updated game",
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Invalid request body",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Unauthorized",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Game not found",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const token = getSessionToken(c.req.raw.headers);
		if (!token) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const session = await validateAdminSession(c.env, token);
		if (!session) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const { id } = c.req.valid("param");
		const body = await c.req.json();
		const result = UpdateGameSchema.safeParse(body);
		if (!result.success) {
			return c.json(
				{ success: false as const, error: "Invalid request body", details: null },
				400,
			);
		}

		const db = drizzle(c.env.DB, { schema });
		const existing = await db.select().from(schema.game).where(eq(schema.game.id, id)).get();

		if (!existing) {
			return c.json(
				{ success: false as const, error: "Game not found", details: null },
				404,
			);
		}

		const [updated] = await db
			.update(schema.game)
			.set({ ...result.data, updatedAt: Date.now() })
			.where(eq(schema.game.id, id))
			.returning();

		return c.json({ success: true as const, data: updated }, 200);
	},
);

gamesRoute.openapi(
	createRoute({
		method: "patch",
		path: "/:id/enable",
		summary: "Enable a game",
		description: "Enable a game by ID. Requires admin authentication.",
		request: {
			params: GameParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: EnableDisableResponseSchema,
					},
				},
				description: "Successfully enabled game",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Unauthorized",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Game not found",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const token = getSessionToken(c.req.raw.headers);
		if (!token) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const session = await validateAdminSession(c.env, token);
		if (!session) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const { id } = c.req.valid("param");

		const db = drizzle(c.env.DB, { schema });
		const existing = await db.select().from(schema.game).where(eq(schema.game.id, id)).get();

		if (!existing) {
			return c.json(
				{ success: false as const, error: "Game not found", details: null },
				404,
			);
		}

		const [updated] = await db
			.update(schema.game)
			.set({ enabled: true, updatedAt: Date.now() })
			.where(eq(schema.game.id, id))
			.returning();

		return c.json({ success: true as const, data: { id: updated.id, enabled: updated.enabled } }, 200);
	},
);

gamesRoute.openapi(
	createRoute({
		method: "patch",
		path: "/:id/disable",
		summary: "Disable a game",
		description: "Disable a game by ID. Requires admin authentication.",
		request: {
			params: GameParamsSchema,
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: EnableDisableResponseSchema,
					},
				},
				description: "Successfully disabled game",
			},
			401: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Unauthorized",
			},
			404: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Game not found",
			},
		},
		tags: ["Games"],
	}),
	async (c) => {
		const token = getSessionToken(c.req.raw.headers);
		if (!token) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const session = await validateAdminSession(c.env, token);
		if (!session) {
			return c.json(
				{ success: false as const, error: "Unauthorized", details: null },
				401,
			);
		}

		const { id } = c.req.valid("param");

		const db = drizzle(c.env.DB, { schema });
		const existing = await db.select().from(schema.game).where(eq(schema.game.id, id)).get();

		if (!existing) {
			return c.json(
				{ success: false as const, error: "Game not found", details: null },
				404,
			);
		}

		const [updated] = await db
			.update(schema.game)
			.set({ enabled: false, updatedAt: Date.now() })
			.where(eq(schema.game.id, id))
			.returning();

		return c.json({ success: true as const, data: { id: updated.id, enabled: updated.enabled } }, 200);
	},
);

export default gamesRoute;