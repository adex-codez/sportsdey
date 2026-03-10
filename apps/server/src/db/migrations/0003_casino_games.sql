CREATE TABLE `game_launch_tokens` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`game` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
CREATE TABLE `game_sessions` (
	`session_token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`game` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
CREATE TABLE `game_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`provider_tx_id` text NOT NULL UNIQUE,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`session_token` text NOT NULL,
	`game` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
CREATE INDEX `game_launch_tokens_user_id_idx` ON `game_launch_tokens`(`user_id`);
CREATE INDEX `game_sessions_user_id_idx` ON `game_sessions`(`user_id`);
CREATE INDEX `game_sessions_status_idx` ON `game_sessions`(`status`);
CREATE INDEX `game_transactions_user_id_idx` ON `game_transactions`(`user_id`);
CREATE INDEX `game_transactions_provider_tx_id_idx` ON `game_transactions`(`provider_tx_id`);
