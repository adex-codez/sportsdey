CREATE TABLE `slotitegration_sessions` (
	`session_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`currency` text DEFAULT 'NGN' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `slotitegration_session_userId_idx` ON `slotitegration_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `slotitegration_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`round_id` text,
	`game_id` text,
	`session_id` text NOT NULL,
	`original_transaction_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slotitegration_transactions_transaction_id_unique` ON `slotitegration_transactions` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `slotitegration_tx_userId_idx` ON `slotitegration_transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `slotitegration_tx_transactionId_idx` ON `slotitegration_transactions` (`transaction_id`);