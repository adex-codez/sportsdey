CREATE TABLE `utility_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`service_type` text NOT NULL,
	`biller_id` text NOT NULL,
	`biller_name` text NOT NULL,
	`recharge_account` text NOT NULL,
	`item_id` text NOT NULL,
	`item_name` text NOT NULL,
	`palm_pay_order_no` text,
	`out_order_no` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utility_transaction_out_order_no_unique` ON `utility_transaction` (`out_order_no`);
