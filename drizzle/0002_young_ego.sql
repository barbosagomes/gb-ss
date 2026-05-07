CREATE TABLE `financial_metrics` (
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