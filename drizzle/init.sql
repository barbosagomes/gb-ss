CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
CREATE TABLE `access_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`sellerId` varchar(255) NOT NULL,
	`shopName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `access_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tiktokProductId` varchar(255) NOT NULL,
	`productName` varchar(512) NOT NULL,
	`description` text,
	`status` varchar(50) NOT NULL DEFAULT 'ACTIVE',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`tiktokSkuId` varchar(255) NOT NULL,
	`skuName` varchar(512) NOT NULL,
	`totalQuantity` int NOT NULL DEFAULT 0,
	`availableQuantity` int NOT NULL DEFAULT 0,
	`reservedQuantity` int NOT NULL DEFAULT 0,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sync_errors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skuId` int,
	`errorType` varchar(100) NOT NULL,
	`errorMessage` text NOT NULL,
	`retryCount` int NOT NULL DEFAULT 0,
	`maxRetries` int NOT NULL DEFAULT 3,
	`nextRetryAt` timestamp,
	`isResolved` int NOT NULL DEFAULT 0,
	`resolvedAt` timestamp,
	`notificationSent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sync_errors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skuId` int NOT NULL,
	`triggerSource` varchar(100) NOT NULL,
	`direction` varchar(20) NOT NULL,
	`quantityBefore` int NOT NULL,
	`quantityAfter` int NOT NULL,
	`delta` int NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'SUCCESS',
	`errorMessage` text,
	`tiktokEventId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sync_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiktok_apps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`appKey` varchar(255) NOT NULL,
	`appSecret` varchar(255) NOT NULL,
	`redirectUrl` varchar(512),
	`isSandbox` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tiktok_apps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `access_tokens` ADD CONSTRAINT `access_tokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skus` ADD CONSTRAINT `skus_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `skus` ADD CONSTRAINT `skus_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sync_errors` ADD CONSTRAINT `sync_errors_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sync_logs` ADD CONSTRAINT `sync_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sync_logs` ADD CONSTRAINT `sync_logs_skuId_skus_id_fk` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tiktok_apps` ADD CONSTRAINT `tiktok_apps_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;CREATE TABLE `financial_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`metricDate` varchar(10) NOT NULL,
	`totalCostDay` varchar(20) DEFAULT '0',
	`estimatedRevenueDay` varchar(20) DEFAULT '0',
	`estimatedProfitDay` varchar(20) DEFAULT '0',
	`averageProfitMargin` varchar(10) DEFAULT '0',
	`productsCount` int DEFAULT 0,
	`skusCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_costs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skuId` int NOT NULL,
	`productCost` varchar(20) NOT NULL,
	`labelCost` varchar(20) DEFAULT '0',
	`packagingCost` varchar(20) DEFAULT '0',
	`bubbleWrapCost` varchar(20) DEFAULT '0',
	`otherCosts` varchar(20) DEFAULT '0',
	`totalCost` varchar(20) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_costs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sku_pricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skuId` int NOT NULL,
	`sellingPrice` varchar(20) NOT NULL,
	`profitMarginPercent` varchar(10) NOT NULL,
	`profitMarginValue` varchar(20) NOT NULL,
	`lastUpdatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sku_pricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `financial_metrics` ADD CONSTRAINT `financial_metrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_costs` ADD CONSTRAINT `product_costs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_costs` ADD CONSTRAINT `product_costs_skuId_skus_id_fk` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sku_pricing` ADD CONSTRAINT `sku_pricing_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sku_pricing` ADD CONSTRAINT `sku_pricing_skuId_skus_id_fk` FOREIGN KEY (`skuId`) REFERENCES `skus`(`id`) ON DELETE no action ON UPDATE no action;