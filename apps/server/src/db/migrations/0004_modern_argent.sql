DROP INDEX `utility_transaction_out_order_no_unique`;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `service_category` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `biller_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `customer_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `customer_name` text;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `product_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `product_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `monnify_transaction_reference` text;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `vend_reference` text NOT NULL;--> statement-breakpoint
ALTER TABLE `utility_transaction` ADD `validation_reference` text;--> statement-breakpoint
CREATE UNIQUE INDEX `utility_transaction_monnify_transaction_reference_unique` ON `utility_transaction` (`monnify_transaction_reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `utility_transaction_vend_reference_unique` ON `utility_transaction` (`vend_reference`);--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `service_type`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `biller_id`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `recharge_account`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `item_id`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `item_name`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `palm_pay_order_no`;--> statement-breakpoint
ALTER TABLE `utility_transaction` DROP COLUMN `out_order_no`;