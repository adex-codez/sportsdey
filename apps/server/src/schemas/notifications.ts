import { z } from "@hono/zod-openapi";

/**
 * Ticket Status Notification Request Schema
 * Received from Betstack for ticket status updates
 */
export const TicketStatusNotificationSchema = z.object({
	type: z.literal("ticket_status").openapi({
		description: "Notification type indicator",
		example: "ticket_status",
	}),
	data: z
		.object({
			ticket_id: z.string().openapi({
				description: "The unique ticket identifier",
				example: "66a62424b1770731244c1f3f",
			}),
			ticket_code: z.string().openapi({
				description: "The unique ticket code",
				example: "AB1234",
			}),
			msisdn: z.string().openapi({
				description: "The reciepient phone number",
				example: "213456451",
			}),
			status: z.string().openapi({
				description: 'Ticket status (e.g., "open" for reserved tickets)',
				example: "open",
			}),
			result: z.string().openapi({
				description: "Ticket result status",
				example: "pending",
			}),
		})
		.openapi({
			description: "Notification data containing ticket information",
		}),
});

/**
 * Notification Acknowledgement Response Schema
 */
export const NotificationAcknowledgementSchema = z.object({
	message: z.string().openapi({
		description: "Acknowledgement message",
		example: "Notification received",
	}),
});
