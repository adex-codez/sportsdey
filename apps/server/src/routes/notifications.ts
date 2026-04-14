import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ErrorResponseSchema } from "@/schemas";
import {
	NotificationAcknowledgementSchema,
	TicketStatusNotificationSchema,
} from "@/schemas/notifications";
import { sendSms } from "@/utils/sms";
import { jsonZodErrorFormatter } from "@/utils/zod";

const notificationsRoute = new OpenAPIHono<{ Bindings: Cloudflare.Env }>();

/**
 * POST /notifications/ticket-status
 * Receives ticket status notifications from Betstack
 * Does not perform header or signature validation
 */

notificationsRoute.openapi(
	createRoute({
		method: "post",
		path: "/ticket-status",
		request: {
			body: {
				content: {
					"application/json": {
						schema: TicketStatusNotificationSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: NotificationAcknowledgementSchema,
					},
				},
				description: "Notification received successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Invalid request body",
			},
			500: {
				content: {
					"application/json": {
						schema: ErrorResponseSchema,
					},
				},
				description: "Internal server error",
			},
		},
		tags: ["Notifications"],
		summary: "Receive Betstack ticket status notification",
		description:
			"Endpoint to receive and validate ticket status notifications from Betstack",
	}),
	async (c) => {
		try {
			const payload = c.req.valid("json");

			const data = payload.data;
			const ticketCode = data.ticket_code || data.ticket_id;
			const recipients = data.msisdn || "";

			const result = (data.result || "").toString().toLowerCase();
			let message = "";

			switch (result) {
				case "pending":
					message = `Payment Received! Your ticket code is ${ticketCode} You can check your status in bet.sportsdey.com/track/${ticketCode}`;
					break;
				case "won":
					message = `Congratulations! Your bet won. Check the ticket details on bet.sportsdey.com/track/${ticketCode}`;
					break;
				case "lost":
					message = `Opps! Your ticket ${ticketCode} didn't win. Check results on bet.sportsdey.com/track/${ticketCode} But the next win could be yours`;
					break;
				case "void":
					message = `Your ticket ${ticketCode} has been voided. Check details on bet.sportsdey.com/track/${ticketCode}`;
					break;
			}

			if (!message || !recipients) {
				return c.json(
					{ success: false as const, error: "sms_not_sent", details: null },
					400,
				);
			}

			const refId = (
				Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
			).slice(0, 15);

			const sms = await sendSms({
				ref_id: refId,
				sender_id: "HALLA",
				recipients,
				telco: "GLO",
				message,
			});

			if (!sms.ok) {
				return c.json(
					{
						success: false as const,
						error: "bulksms_error",
						details: sms.error,
					},
					502,
				);
			}

			return c.json(
				{
					message: "Notification received",
					body: sms && sms.body,
				},
				200,
			);
		} catch (error) {
			return c.json(
				{
					success: false as const,
					error: "Internal server error",
					details: null,
				},
				500,
			);
		}
	},
	jsonZodErrorFormatter,
);

export default notificationsRoute;
