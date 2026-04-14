CREATE TABLE `thundr_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`round_id` text NOT NULL,
	`game_id` text NOT NULL,
	`session_id` text NOT NULL,
	`original_transaction_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `thundr_transactions_transaction_id_unique` ON `thundr_transactions` (`transaction_id`);